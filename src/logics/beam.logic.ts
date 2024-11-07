import { Beam, BeamResult, BeamType } from "@/types/beam.type";
import { getEquivalentRectangularStressValues } from "@/types/concrete.type";
import { SteelArea } from "@/types/steel.type";

const MAX_COMPUTE_DURATION = 4000; // 최대 계산 시간 4초

/** 빔 설계 페이지 계산 로직 */
export default function computeBeamDesign(beam: BeamType): BeamResult {
  // 등가직사각형을 통한 변수 획득
  const { eps_cu, beta, eta } = getEquivalentRectangularStressValues(beam[Beam.fc_prime]);

  /**
   * ---------------------
   * 1. 최대 휨 강도 계산
   * ---------------------
   */

  let cMin = 0; // 최소 가능한 c 값
  let cMax = beam[Beam.h]; // 최대 가능한 c 값
  let c = (cMax + cMin) / 2; // 압축대 깊이 mm (초기값은 빔 높이의 절반)

  // 결과 값을 담기위한 변수 선언
  let steel_compression_moment = undefined; // 압축 철근 모멘트
  let steel_tension_moment = undefined; // 인장 철근 모멘트
  let concrete_moment = undefined; // 콘크리트 모멘트
  let total_moment = undefined; // 총 모멘트
  let pi_moment = undefined; // 강도 감수 계수

  const computeStartTime = Date.now(); // 컴퓨팅 시작 시간
  let sigmaFx: number | undefined = undefined; // ΣFx 설정 (ΣFx가 0.1 이하가 될때, 평형 조건을 만족했다고 판단) -> 합력이 0.1 이하가 될 때까지 반복
  while (true) {
    // 컴퓨팅 시간이 MAX_COMPUTE_DURATION 이상이면 종료
    const computeDuration = Date.now() - computeStartTime;
    if (computeDuration > MAX_COMPUTE_DURATION) throw Error("최대 컴퓨팅 시간을 초과했습니다.");

    /** STRAIN */
    // a. 압축 철근
    const steel_compression_strain = (eps_cu * (c - beam[Beam.top_steel_y])) / c;
    // b. 인장 철근 (* 해당 값을 통해 압축지배인지 인장지배인지 판단)
    const steel_tension_strain = (eps_cu * (c - beam[Beam.bottom_steel_y])) / c;

    /** STRESS */
    // a. 압축 철근
    const steel_compression_stress = Math.max(
      -beam[Beam.fy_t],
      Math.min(beam[Beam.fy_t], steel_compression_strain * beam[Beam.elasticity_steel])
    );
    // b. 인장 철근
    const steel_tension_stress = Math.max(
      -beam[Beam.fy_b],
      Math.min(beam[Beam.fy_b], steel_tension_strain * beam[Beam.elasticity_steel])
    );
    // c. 콘크리트
    const concrete_area = beta * c * beam[Beam.b];
    const concrete_stress = -eta * beam[Beam.fc_prime] * 0.85;

    /** FORCE */
    // a. 압축 철근
    const steel_compression_force =
      steel_compression_stress * SteelArea[beam[Beam.top_steel_d] as keyof typeof SteelArea] * beam[Beam.top_steel_n];
    // b. 인장 철근
    const steel_tension_force =
      steel_tension_stress * SteelArea[beam[Beam.bottom_steel_d] as keyof typeof SteelArea] * beam[Beam.bottom_steel_n];
    // c. 콘크리트
    const concrete_force = concrete_stress * concrete_area;

    /** 평형 조건 계산 */
    const equilibriumForce = steel_compression_force + steel_tension_force + concrete_force;

    if (Math.abs(equilibriumForce) <= 0.1) {
      // 평형 조건 만족시 결과 주입 및 종료
      steel_compression_moment = -steel_compression_force * (beam[Beam.h] / 2 - beam[Beam.top_steel_y]);
      steel_tension_moment = -steel_tension_force * (beam[Beam.h] / 2 - beam[Beam.bottom_steel_y]);
      concrete_moment = -concrete_force * (beam[Beam.h] / 2 - (c * beta) / 2);
      total_moment = steel_compression_moment + steel_tension_moment + concrete_moment;
      pi_moment = _computePiValue(beam[Beam.fy_b], beam[Beam.elasticity_steel], steel_tension_strain);
      break;
    } else {
      // 평형 조건 불만족시 c값 조정
      // TODO up-down 알고리즘에서 newton-raphson 알고리즘으로 변경
      // equilibriumForce이 양수면 c값 증가, 음수면 c값 감소
      sigmaFx = equilibriumForce;
      if (equilibriumForce < 0) {
        cMax = c;
        c = (cMin + c) / 2;
      } else {
        cMin = c;
        c = (c + cMax) / 2;
      }
    }
  }

  /**
   * -----------------
   * 2. 전단 강도 계산
   * -----------------
   */

  const stirrup_area = SteelArea[beam[Beam.stirrup_d] as keyof typeof SteelArea] * beam[Beam.stirrup_n]; // 전단 철근 단면적
  const concrete_shear_force = (1 / 6) * Math.sqrt(beam[Beam.fc_prime]) * beam[Beam.b] * beam[Beam.stirrup_h_prime];
  const steel_shear_force = (stirrup_area * beam[Beam.fy_v] * beam[Beam.stirrup_h_prime]) / beam[Beam.stirrup_s];
  const total_shear_force = concrete_shear_force + steel_shear_force;

  const max_shear_force = (5 / 6) * Math.sqrt(beam[Beam.fc_prime]) * beam[Beam.b] * beam[Beam.stirrup_h_prime];

  const shear_force = Math.min(total_shear_force, max_shear_force);
  const pi_shear_force = 0.75; // 고정값.

  if (
    steel_compression_moment === undefined ||
    steel_tension_moment === undefined ||
    concrete_moment === undefined ||
    total_moment === undefined ||
    pi_moment === undefined ||
    c === undefined ||
    steel_shear_force === undefined ||
    concrete_shear_force === undefined ||
    max_shear_force === undefined ||
    shear_force === undefined ||
    pi_shear_force === undefined
  ) {
    throw Error("unknown error");
  }

  return {
    steel_compression_moment, // N*mm
    steel_tension_moment, // N*mm
    concrete_moment, // N*mm
    total_moment, // N*mm
    pi_moment,
    c,
    steel_shear_force, // N
    concrete_shear_force, // N
    max_shear_force, // N
    shear_force, // N
    pi_shear_force,
  };
}

/** 모멘트 강도 감수 계수 계산 */
function _computePiValue(fy: number, Es: number, eps_t: number) {
  const eps_y = fy / Es; // 압축 지배 구간 기준선
  const eps_y2 = eps_y * 2.5; // 인장 지배 구간 기준선

  // 압축 지배 구간
  if (eps_t < eps_y) return 0.65;

  // 인장 지배 구간
  if (eps_t > eps_y2) return 0.85;

  // 변화구간. NOTE: eps_y와 eps_y2 사이의 값은 선형 보간을 통해 계산
  return 0.65 + (eps_t - eps_y) * (0.2 / (eps_y2 - eps_y));
}
