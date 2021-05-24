import LinkChakra from "@/components/common/link-chakra";
import { Subtype } from "@/models/index";
import { graphData } from "@/models/index";
import { Box } from "@chakra-ui/react";

import { ResponsiveBump } from "@nivo/bump";
import dayjs from "dayjs";

interface GraphProps {
  mode: Subtype;
  gds: graphData[];
}
const NivoBump = (props: GraphProps) => {
  let themeText = "rgba(0,0,0,1)";
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
        /* nivo bumpになぜかlegendsを追加していなかったので、とりあえず追加したが
        bumpコンポーネントがこれを受け付けない可能性もある(未検証) */
        legends={[
          {
            data: [
              ...(props.gds.map((gd) => {
                return {
                  id: gd.id,
                  label: gd.label,
                  color: gd.color,
                  fill: gd.color,
                };
              }) as any),
            ],
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            itemTextColor: themeText,
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: themeText,
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </Box>
  );
};

export default NivoBump;
