import {
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Text,
  Tooltip,
  Wrap,
} from "@chakra-ui/react";
import { PAGE_STEP } from "@/types/step.type";
import { Beam, BeamDisplayName, BeamToolTip, BeamType } from "@/types/beam.type";
import { FormikErrors } from "formik";
import { useRouter } from "next/router";
import { useBeamState } from "@/hooks/useBeamState";

// BeamPage UI
export const BeamPage = () => {
  const router = useRouter();
  const { pageStep, setPageStep, formik, result } = useBeamState();

  switch (pageStep) {
    // 데이터 입력 UI
    case PAGE_STEP.INPUT:
      return (
        <form onSubmit={formik.handleSubmit} className="p-8">
          {/* 기본 데이터 */}
          <Heading size="md">✏️ 기본 데이터</Heading>
          <Wrap spacing="30px" my={6}>
            <BeamInputComponent
              type={Beam.fc_prime}
              value={formik.values[Beam.fc_prime]}
              setValue={formik.setFieldValue}
            />
            <BeamInputComponent type={Beam.b} value={formik.values[Beam.b]} setValue={formik.setFieldValue} />
            <BeamInputComponent type={Beam.h} value={formik.values[Beam.h]} setValue={formik.setFieldValue} />
            <BeamInputComponent
              type={Beam.elasticity_steel}
              value={formik.values[Beam.elasticity_steel]}
              setValue={formik.setFieldValue}
            />
          </Wrap>
          <Divider my={8} />

          {/* 상부 철근 데이터 */}
          <Heading size="md">✏️ 상부 철근 데이터</Heading>
          <Wrap spacing="30px" my={6}>
            <BeamInputComponent type={Beam.fy_t} value={formik.values[Beam.fy_t]} setValue={formik.setFieldValue} />
            <BeamInputComponent
              type={Beam.top_steel_n}
              value={formik.values[Beam.top_steel_n]}
              setValue={formik.setFieldValue}
            />
            <BeamInputComponent
              type={Beam.top_steel_d}
              value={formik.values[Beam.top_steel_d]}
              setValue={formik.setFieldValue}
            />
            <BeamInputComponent
              type={Beam.top_steel_y}
              value={formik.values[Beam.top_steel_y]}
              setValue={formik.setFieldValue}
            />
          </Wrap>
          <Divider my={8} />

          {/* 하부 철근 데이터 */}
          <Heading size="md">✏️ 하부 철근 데이터</Heading>
          <Wrap spacing="30px" my={6}>
            <BeamInputComponent type={Beam.fy_b} value={formik.values[Beam.fy_b]} setValue={formik.setFieldValue} />
            <BeamInputComponent
              type={Beam.bottom_steel_n}
              value={formik.values[Beam.bottom_steel_n]}
              setValue={formik.setFieldValue}
            />
            <BeamInputComponent
              type={Beam.bottom_steel_d}
              value={formik.values[Beam.bottom_steel_d]}
              setValue={formik.setFieldValue}
            />
            <BeamInputComponent
              type={Beam.bottom_steel_y}
              value={formik.values[Beam.bottom_steel_y]}
              setValue={formik.setFieldValue}
            />
          </Wrap>
          <Divider my={8} />

          {/* 늑근(띠철근) 데이터 */}
          <Heading size="md">✏️ 늑근(띠철근) 데이터</Heading>
          <Wrap spacing="30px" my={6}>
            <BeamInputComponent
              type={Beam.stirrup_n}
              value={formik.values[Beam.stirrup_n]}
              setValue={formik.setFieldValue}
            />
            <BeamInputComponent
              type={Beam.stirrup_d}
              value={formik.values[Beam.stirrup_d]}
              setValue={formik.setFieldValue}
            />
            <BeamInputComponent
              type={Beam.stirrup_s}
              value={formik.values[Beam.stirrup_s]}
              setValue={formik.setFieldValue}
            />
            <BeamInputComponent
              type={Beam.stirrup_h_prime}
              value={formik.values[Beam.stirrup_h_prime]}
              setValue={formik.setFieldValue}
            />
            <BeamInputComponent type={Beam.fy_v} value={formik.values[Beam.fy_v]} setValue={formik.setFieldValue} />
          </Wrap>

          {/* 결과 페이지로 이동 버튼 */}
          <Button isDisabled={!formik.isValid} mt={8} w="full" type="submit" colorScheme="blue">
            Show Result
          </Button>
        </form>
      );

    // 데이터 처리중 UI
    case PAGE_STEP.PROCESSING:
      return (
        <Center h="full">
          <Spinner thickness="4px" color="blue.500" size="lg" />
        </Center>
      );

    // 결과 UI
    case PAGE_STEP.RESULT:
      if (!result) return <Center>No Data</Center>;
      return (
        <div className="p-8 flex flex-col">
          {/* 휨 강도 결과 */}
          <Heading size="md">✅ Result of M</Heading>
          <ResultComponent title="C (mm)" value={result.c} />
          <ResultComponent title="Compression Steel Moment (kN*m)" value={result.steel_compression_moment / 1000000} />
          <ResultComponent title="Tension Steel Moment (kN*m)" value={result.steel_tension_moment / 1000000} />
          <ResultComponent title="Concrete Moment (kN*m)" value={result.concrete_moment / 1000000} />
          <ResultComponent title="Total Moment (kN*m)" value={result.total_moment / 1000000} />

          <ResultComponent title="ϕ" value={result.pi_moment} />
          <ResultComponent title="ϕMn (kN*m)" value={(result.pi_moment * result.total_moment) / 1000000} />

          <Divider my={8} />

          {/* 전단 강도 결과 */}
          <Heading size="md">✅ Result of V</Heading>
          <ResultComponent title="Steel Shear Force" value={result.steel_shear_force / 1000} />
          <ResultComponent title="Concrete Shear Force" value={result.contrete_shear_force / 1000} />
          <ResultComponent title="Max Shear Force" value={result.max_shear_force / 1000} />
          <ResultComponent title="Shear Force" value={result.shear_force / 1000} />

          <ResultComponent title="ϕ (Fixed)" value={result.pi_shear_force} />
          <ResultComponent title="ϕVn" value={(result.shear_force * result.pi_shear_force) / 1000} />

          <HStack w="full" mt={4}>
            <Button className="flex-grow" onClick={() => setPageStep(PAGE_STEP.INPUT)} colorScheme="blue">
              Back
            </Button>
            <Button className="flex-grow" onClick={() => router.push("/")} colorScheme="blue">
              Home
            </Button>
          </HStack>
        </div>
      );
  }
};

export default BeamPage;

/** 데이터 입력 컴포넌트 */
const BeamInputComponent = ({
  type,
  step,
  value,
  setValue,
}: {
  type: Beam;
  step?: number;
  // NOTE formik 전체 받지말고 value와 setValue만 받음처리
  value: number;
  setValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void> | Promise<FormikErrors<BeamType>>;
}) => {
  return (
    <div className="flex items-center gap-4">
      <Tooltip label={BeamToolTip[type]}>
        <div className="text-[16px] font-bold">{BeamDisplayName[type]}</div>
      </Tooltip>
      <NumberInput
        step={step}
        name={type}
        value={value}
        onChange={(valueString) => setValue(type, Number(valueString))}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </div>
  );
};

/** 데이터 결과 컴포넌트 */
const ResultComponent = ({ title, value }: { title: string; value: number }) => {
  return (
    <HStack my={3}>
      <Text fontSize="20px">{`${title} :`}</Text>
      <Heading size="md">{value}</Heading>
    </HStack>
  );
};
