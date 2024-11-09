import computeColumnDesign from "@/logics/column.logic";
import { Column, ColumnResult, ColumnType } from "@/types/column.type";
import { PAGE_STEP } from "@/types/step.type";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";

// ColumnPage 상태관리
export function useColumnState() {
  // 페이지 스텝 (입력, 처리, 결과)
  const [pageStep, setPageStep] = useState<PAGE_STEP>(PAGE_STEP.INPUT);

  // 처리 결과
  const [result, setResult] = useState<ColumnResult>();

  // 입력 데이터 관리
  const formik = useFormik<ColumnType>({
    initialValues: {
      [Column.fc_prime]: 30,
      [Column.b]: 500,
      [Column.h]: 500,
      [Column.elasticity_steel]: 200000,
      [Column.fy]: 600,
      [Column.steel_d]: 25,
      [Column.steel_data]: [
        { y: 55, n: 4 },
        { y: 185, n: 2 },
        { y: 315, n: 2 },
        { y: 445, n: 4 },
      ],
      [Column.fy_v]: 400,
      [Column.stirrup_n]: 2,
      [Column.stirrup_d]: 13,
      [Column.stirrup_s]: 150,
    },
    // isInitialValid: false,
    onSubmit: (values) => {
      // 상태를 PROCESSING으로 업데이트
      setPageStep(PAGE_STEP.PROCESSING);

      // 비동기적으로 computeColumnDesign을 실행
      setTimeout(() => {
        const result = computeColumnDesign(values);
        setResult(result);

        // 상태를 RESULT로 업데이트
        setPageStep(PAGE_STEP.RESULT);
      }, 0);
    },
    validationSchema: yup.object({
      //todo validation 로직 추가 (철근비 1%이상 8% 이하, 단주기둥인지 확인 등)
    }),
  });

  return { pageStep, setPageStep, formik, result };
}
