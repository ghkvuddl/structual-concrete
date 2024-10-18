import computeBeamDesign from "@/logics/beam.logic";
import { BeamResult, BeamType, Beam } from "@/types/beam.type";
import { SUPPORTED_STEEL_DIAMETER } from "@/types/steel.type";
import { PAGE_STEP } from "@/types/step.type";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";

// BeamPage 상태관리
export function useBeamState() {
  // 페이지 스텝 (입력, 처리, 결과)
  const [pageStep, setPageStep] = useState<PAGE_STEP>(PAGE_STEP.INPUT);

  // 처리 결과
  const [result, setResult] = useState<BeamResult>();

  // 입력 데이터 관리
  const formik = useFormik<BeamType>({
    initialValues: {
      [Beam.fc_prime]: 30,
      [Beam.b]: 300,
      [Beam.h]: 800,
      [Beam.elasticity_steel]: 200000,
      [Beam.fy_t]: 600,
      [Beam.top_steel_n]: 2,
      [Beam.top_steel_d]: 19,
      [Beam.top_steel_y]: 50,
      [Beam.fy_b]: 600,
      [Beam.bottom_steel_n]: 4,
      [Beam.bottom_steel_d]: 25,
      [Beam.bottom_steel_y]: 750,
      [Beam.fy_v]: 400,
      [Beam.stirrup_n]: 2,
      [Beam.stirrup_d]: 13,
      [Beam.stirrup_s]: 150,
      [Beam.stirrup_h_prime]: 750,
    },
    // isInitialValid: false,
    onSubmit: (values) => {
      setPageStep(PAGE_STEP.PROCESSING);

      const result = computeBeamDesign(values);
      setResult(result);

      setPageStep(PAGE_STEP.RESULT);
    },
    validationSchema: yup.object({
      //todo validation 로직 추가
    }),
  });

  return { pageStep, setPageStep, formik, result };
}
