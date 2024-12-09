import { BeamType } from "@/types/beam.type";
import { Wrap } from "@chakra-ui/react";
import React from "react";

const SCALE_FACTOR = 0.4;
const STEEL_SIZE = 10;

// 보의 단면 그래픽
const BeamDiagramGraphic = ({ data }: { data: BeamType }) => {
  const { b, h, top_steel_n, top_steel_y, bottom_steel_n, bottom_steel_y, stirrup_n, stirrup_s } = data;
  const width = b * SCALE_FACTOR;
  const height = h * SCALE_FACTOR;
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
          <div
            style={{
              display: "flex",
              position: "absolute",
              width: "100%",
              left: 0,
              top: `${top_steel_y * SCALE_FACTOR - STEEL_SIZE / 2}px`,
              justifyContent: "space-between",
              padding: "0 16px",
            }}
          >
            {Array.from({ length: top_steel_n }).map((_, i) => (
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
          <div
            style={{
              display: "flex",
              position: "absolute",
              width: "100%",
              left: 0,
              top: `${bottom_steel_y * SCALE_FACTOR - STEEL_SIZE / 2}px`,
              justifyContent: "space-between",
              padding: "0 16px",
            }}
          >
            {Array.from({ length: bottom_steel_n }).map((_, i) => (
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
        </div>
        <p style={{ marginTop: "8px" }}>단면</p>
      </div>

      {/* 측면 */}
      <div className="flex flex-col items-center">
        <div
          className="relative"
          style={{
            height,
            backgroundColor: "rgb(190,190,190)",
            minWidth: stirrup_spacing * 4,
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
            borderLeft: "1px dashed black",
            borderRight: "1px dashed black",
          }}
        >
          <div
            className="absolute left-0 top-0 w-full h-full flex"
            style={{ gap: stirrup_spacing, paddingLeft: stirrup_spacing / 2 - 8 }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ width: 4, backgroundColor: "rgba(255, 99, 71, 0.8)", border: "1px solid red" }} />
            ))}
          </div>
        </div>
        <p style={{ marginTop: "8px" }}>{`측면 (늑근 간격:${stirrup_s}mm)`}</p>
      </div>
    </Wrap>
  );
};

export default React.memo(BeamDiagramGraphic);
