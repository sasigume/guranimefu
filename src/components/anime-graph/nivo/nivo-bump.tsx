import { Subtype, graphData } from "@/models/jikan_v4";
import { Box } from "@chakra-ui/react";

import { ResponsiveBump } from "@nivo/bump";
import dayjs from "dayjs";

interface GraphProps {
  mode: Subtype;
  gds: graphData[];
}

type graphSingleData = { x: string; y: string };
const NivoBump = (props: GraphProps) => {
  return (
    <Box w="full" h="full">
      <ResponsiveBump
        data={props.gds}
        margin={{ top: 40, right: 200, bottom: 40, left: 60 }}
        colors={{ datum: "color" }}
        //@ts-ignore
        xScale={{
          type: "time",
          format: "%Y-%m-%d",
        }}
        xFormat="time:%Y-%m-%d"
        lineWidth={4}
        activeLineWidth={6}
        inactiveLineWidth={4}
        inactiveOpacity={0.3}
        pointSize={10}
        activePointSize={16}
        inactivePointSize={6}
        pointColor={{ theme: "background" }}
        pointBorderWidth={3}
        activePointBorderWidth={3}
        pointBorderColor={{ from: "serie.color" }}
        tooltip={(pointObj: any) => {
          return (
            <Box bg="white" p={1} shadow="lg">
              <strong>{pointObj.serie.label}</strong>
              <br />
              <b>
                {"Last 3 days: "}
                {pointObj.serie.data
                  .slice(-3)
                  .map((d: graphSingleData, n: number) => (
                    <>
                      {/* 順位の推移を表示 */}
                      <strong area-label="アニメタイトル">{d.y}</strong>
                      <span>{n < 2 && ` → `}</span>
                    </>
                  ))}
              </b>
            </Box>
          );
        }}
        axisTop={{
          //@ts-ignore
          format: function (value: string) {
            return dayjs(value).format("MM/DD");
          } as string,
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: -36,
        }}
        axisRight={null}
        axisBottom={{
          //@ts-ignore
          format: function (value: string) {
            return dayjs(value).format("MM/DD");
          } as string,
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "順位",
          legendPosition: "middle",
          legendOffset: -50,
          format: function (value: string) {
            return `${value}位`;
          },
        }}
      />
    </Box>
  );
};

export default NivoBump;
