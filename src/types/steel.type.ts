export const SUPPORTED_STEEL_DIAMETER = [10, 13, 16, 19, 22, 25, 29, 32] as const;

/**
 * 철근 단면적 반환
 *
 * D10: 71.3 mm²,
 * D13: 126.7 mm²,
 * D16: 198.6 mm²,
 * D19: 286.5 mm²,
 * D22: 387.1 mm²,
 * D25: 506.7 mm²,
 * D29: 642.4 mm²,
 * D32: 794.2 mm²,
 *
 */
export const SteelArea: { [key in (typeof SUPPORTED_STEEL_DIAMETER)[number]]: number } = {
  10: 71.3,
  13: 126.7,
  16: 198.6,
  19: 286.5,
  22: 387.1,
  25: 506.7,
  29: 642.4,
  32: 794.2,
};
