import { ColumnType, SteelData } from "@/types/column.type";
import { Wrap } from "@chakra-ui/react";
import React from "react";

const SCALE_FACTOR = 0.5;
const STEEL_SIZE = 12;

// 기둥 단면 그래픽
const ColumnDiagramGraphic = ({ data }: { data: ColumnType }) => {
  const { b, h, steel_data, stirrup_n, stirrup_s } = data;
  const width = b * SCALE_FACTOR;
  const height = h * SCALE_FACTOR;
  const steel_array = steel_data.map((d) => ({ ...d, y: d[SteelData.y] * SCALE_FACTOR }));
  // const stirrup_num = stirrup_n;
  const stirrup_spacing = stirrup_s * SCALE_FACTOR;

  return (
    <Wrap justify="space-around" align="center" spacingX={10}>
      {/* 단면 */}
      <div className="flex flex-col items-center">
        <div
          style={{
            position: "relative",
            width,
            height,
            backgroundColor: "rgb(190,190,190)",
            border: "1px solid black",
          }}
        >
          {steel_array.map((d, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                position: "absolute",
                width: "100%",
                left: 0,
                top: `${d.y - STEEL_SIZE / 2}px`,
                justifyContent: "space-between",
                padding: "0 16px",
              }}
            >
              {Array.from({ length: d[SteelData.n] }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: STEEL_SIZE,
                    width: STEEL_SIZE,
                    backgroundColor: "rgba(255, 99, 71, 0.8)",
                    border: "1px solid red",
                    borderRadius: STEEL_SIZE / 2,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <p style={{ marginTop: "8px" }}>단면</p>
      </div>

      {/* 측면 */}
      <div className="flex flex-col items-center">
        <div
          className="relative"
          style={{
            width,
            backgroundColor: "rgb(190,190,190)",
            minHeight: stirrup_spacing * 4,
            borderTop: "1px dashed black",
            borderBottom: "1px dashed black",
            borderLeft: "1px solid black",
            borderRight: "1px solid black",
          }}
        >
          <div
            className="absolute left-0 top-0 w-full h-full flex flex-col"
            style={{ gap: stirrup_spacing, paddingTop: stirrup_spacing / 2 - 8 }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 4, backgroundColor: "rgba(255, 99, 71, 0.8)", border: "1px solid red" }} />
            ))}
          </div>
        </div>
        <p style={{ marginTop: "8px" }}>{`측면 (늑근 간격:${stirrup_s}mm)`}</p>
      </div>
    </Wrap>
  );
};

export default React.memo(ColumnDiagramGraphic);
