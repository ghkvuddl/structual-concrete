/** Equivalent Rectangular Stress Block (등가직사각형 응력분포 변수 값) */
export function getEquivalentRectangularStressValues(fc_prime: number): { eps_cu: number; beta: number; eta: number } {
  // 40MPa 이하
  if (fc_prime <= 40) return { eps_cu: -0.0033, beta: 0.8, eta: 1 };
  // 50MPa 이하
  if (fc_prime <= 50) return { eps_cu: -0.0032, beta: 0.8, eta: 0.97 };
  // 60MPa 이하
  if (fc_prime <= 60) return { eps_cu: -0.0031, beta: 0.76, eta: 0.95 };
  // 70MPa 이하
  if (fc_prime <= 70) return { eps_cu: -0.003, beta: 0.74, eta: 0.91 };
  // 80MPa 이하
  if (fc_prime <= 80) return { eps_cu: -0.0029, beta: 0.72, eta: 0.87 };
  // 90MPa 이하 및 그 이상
  return { eps_cu: -0.0028, beta: 0.7, eta: 0.84 };
}

// NOTE *value from KDS 14 20 20
