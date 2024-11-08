import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Card,
  Center,
  CloseButton,
  Divider,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  Wrap,
} from "@chakra-ui/react";
import { PAGE_STEP } from "@/types/step.type";
import { FormikErrors } from "formik";
import { useRouter } from "next/router";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { SUPPORTED_STEEL_DIAMETER } from "@/types/steel.type";
import { PropsWithChildren } from "react";
import { Column, ColumnDisplayName, ColumnToolTip, ColumnType, SteelData, SteelDataToolTip } from "@/types/column.type";
import { useColumnState } from "@/hooks/useColumnState";

// ColumnPage UI
const ColumnPage = () => {
  const router = useRouter();
  const { pageStep, setPageStep, formik, result } = useColumnState();

  switch (pageStep) {
    // 데이터 입력 UI
    case PAGE_STEP.INPUT:
      return (
        <form onSubmit={formik.handleSubmit} className="p-8">
          {/* 기둥 단면 그래픽*/}
          <Wrap>
            {/* 단면 */}
            <div></div>

            {/* 측면 */}
            <div></div>
          </Wrap>
          {/* <Divider my={8} /> */}

          {/* 기본 데이터 */}
          <Heading size="md">✏️ 기본 데이터</Heading>
          <Wrap spacing="30px" my={6}>
            <ColumnInputComponent
              type={Column.fc_prime}
              value={formik.values[Column.fc_prime]}
              setValue={formik.setFieldValue}
            />
            <ColumnInputComponent type={Column.b} value={formik.values[Column.b]} setValue={formik.setFieldValue} />
            <ColumnInputComponent type={Column.h} value={formik.values[Column.h]} setValue={formik.setFieldValue} />
            <ColumnInputComponent
              type={Column.elasticity_steel}
              value={formik.values[Column.elasticity_steel]}
              setValue={formik.setFieldValue}
              step={10000}
            />
          </Wrap>
          <Divider my={8} />

          {/* 주철근 데이터 */}
          <Heading size="md">✏️ 주철근 데이터</Heading>
          <Wrap spacing="30px" my={6}>
            <ColumnInputComponent
              type={Column.fy}
              value={formik.values[Column.fy]}
              setValue={formik.setFieldValue}
              step={50}
            />
            <ColumnInputComponent type={Column.steel_d}>
              <Menu>
                <MenuButton w={"180px"} as={Button} rightIcon={<ChevronDownIcon />}>
                  {`D-${formik.values[Column.steel_d]}`}
                </MenuButton>
                <MenuList>
                  {SUPPORTED_STEEL_DIAMETER.map((d) => (
                    <MenuItem key={d} onClick={() => formik.setFieldValue(Column.steel_d, d)}>{`D-${d}`}</MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </ColumnInputComponent>
          </Wrap>

          {formik.values[Column.steel_data].map((data, index) => {
            return (
              <HStack key={index} my={4} maxW="560px">
                <Card
                  w="full"
                  bgColor="gray.100"
                  py={2}
                  px={4}
                  flexDirection="row"
                  justifyContent="space-between"
                  gap={2}
                >
                  {Object.keys(SteelData).map((key) => {
                    return (
                      <div key={key} className="flex items-center gap-4">
                        <Tooltip label={SteelDataToolTip[key as SteelData]}>
                          <div className="text-[16px] font-bold">{`${key}${index + 1}`}</div>
                        </Tooltip>
                        <NumberInput
                          maxW="200px"
                          name={`steel_data[${index}].${key}`}
                          value={data[key as keyof typeof data]}
                          min={1}
                          onChange={(valueString) => {
                            const newData = formik.values[Column.steel_data].map((d, i) =>
                              i === index ? { ...d, [key]: Number(valueString) } : d
                            );
                            formik.setFieldValue(Column.steel_data, newData);
                          }}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </div>
                    );
                  })}
                </Card>
                <CloseButton
                  onClick={() => {
                    formik.setFieldValue(
                      Column.steel_data,
                      formik.values[Column.steel_data].filter((_, i) => i !== index)
                    );
                  }}
                />
              </HStack>
            );
          })}

          <Button
            onClick={() => {
              formik.setFieldValue(Column.steel_data, [...formik.values[Column.steel_data], { y: 1, n: 1 }]);
            }}
            type="button"
            px="32px"
            colorScheme="blue"
          >
            주철근 추가
          </Button>

          <Divider my={8} />

          {/* 늑근(띠철근) 데이터 */}
          <Heading size="md">✏️ 늑근(띠철근) 데이터</Heading>
          <Wrap spacing="30px" my={6}>
            <ColumnInputComponent
              type={Column.fy_v}
              value={formik.values[Column.fy_v]}
              setValue={formik.setFieldValue}
              step={50}
            />

            <ColumnInputComponent
              type={Column.stirrup_n}
              value={formik.values[Column.stirrup_n]}
              setValue={formik.setFieldValue}
            />

            <ColumnInputComponent type={Column.stirrup_d}>
              <Menu>
                <MenuButton w={"180px"} as={Button} rightIcon={<ChevronDownIcon />}>
                  {`D-${formik.values[Column.stirrup_d]}`}
                </MenuButton>
                <MenuList>
                  {SUPPORTED_STEEL_DIAMETER.map((d) => (
                    <MenuItem key={d} onClick={() => formik.setFieldValue(Column.stirrup_d, d)}>{`D-${d}`}</MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </ColumnInputComponent>

            <ColumnInputComponent
              type={Column.stirrup_s}
              value={formik.values[Column.stirrup_s]}
              setValue={formik.setFieldValue}
            />
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
          {/* PM 결과 그래픽 */}
          <Heading size="md" my={4}>
            ✅ P,M Graph
          </Heading>

          {/* PM 결과 표 */}
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton px={0} py={4}>
                <Heading size="md">✅ Table of P,M</Heading>
                <AccordionIcon boxSize={8} />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <TableContainer>
                  <Table variant="striped" colorScheme="blue">
                    <TableCaption>c값에 따른 P, M 표 (*Pmax 적용됨)</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>c</Th>
                        <Th isNumeric>P (kN)</Th>
                        <Th isNumeric>M (kN*m)</Th>
                        <Th>𝜙</Th>
                        <Th isNumeric>𝜙P (kN)</Th>
                        <Th isNumeric>𝜙M (kN*m)</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {result.PMData.map((data, index) => {
                        const P = data.p / 1000;
                        const M = data.m / 1000000;
                        return (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td isNumeric>{P.toFixed(4)}</Td>
                            <Td isNumeric>{M.toFixed(4)}</Td>
                            <Td>{data.pi.toFixed(2)}</Td>
                            <Td isNumeric>{(P * data.pi).toFixed(4)}</Td>
                            <Td isNumeric>{(M * data.pi).toFixed(4)}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {/* 전단 강도 결과 */}
          <Heading my={4} size="md">
            ✅ Result of V
          </Heading>
          <ResultComponent title="Shear Force (kN)" value={result.shear_force / 1000} />
          <ResultComponent title="ϕ (Fixed)" value={`${result.pi_shear_force}`} />
          <ResultComponent title="ϕVn (kN)" value={(result.shear_force * result.pi_shear_force) / 1000} />

          <HStack w="full">
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

export default ColumnPage;

/** 데이터 입력 컴포넌트 */
const ColumnInputComponent = ({
  type,
  step,
  value = 0,
  setValue,
  children, // 커스텀 input UI 필요시 전달
}: PropsWithChildren<{
  type: Column;
  step?: number;
  // NOTE formik 전체 받지말고 value와 setValue만 받음처리
  value?: number;
  setValue?: (field: string, value: any, shouldValidate?: boolean) => Promise<void> | Promise<FormikErrors<ColumnType>>;
}>) => {
  return (
    <div className="flex items-center gap-4">
      <Tooltip label={ColumnToolTip[type]}>
        <div className="text-[16px] font-bold">{ColumnDisplayName[type]}</div>
      </Tooltip>
      {children ?? (
        <NumberInput
          step={step}
          name={type}
          value={value}
          onChange={(valueString) => setValue && setValue(type, Number(valueString))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      )}
    </div>
  );
};

/** 데이터 결과 컴포넌트 */
const ResultComponent = ({ title, value }: { title: string; value: number | string }) => {
  return (
    <HStack my={3}>
      <Text fontSize="20px">{`${title} :`}</Text>
      <Heading size="md">{typeof value == "number" ? value.toFixed(4) : value}</Heading>
    </HStack>
  );
};
