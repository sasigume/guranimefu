import { Subtype } from '@/models/index'
import { graphData } from "@/models/index"
import { Box, useColorMode } from "@chakra-ui/react"

import { ResponsiveLine } from '@nivo/line'
import dayjs from "dayjs"

interface GraphProps {
  gds: graphData[],
  mode: Subtype
}
const NivoLine = (props: GraphProps) => {

  let themeText = "rgba(0,0,0,1)"
  const { colorMode } = useColorMode()
  colorMode == "dark" ? themeText = "rgba(255,255,255,1)" : themeText = "rgba(0,0,0,1)"
  return (
    <Box w="full" h="full">
      <ResponsiveLine
        data={props.gds}
        colors={{ datum: 'color' }}
        margin={{ top: 60, right: 210, bottom: 60, left: 60 }}
        xScale={{
          type: "time",
          format: "%Y-%m-%d"
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{ type: 'linear', min: 'auto', max: 'auto', reverse: false }}
        //yFormat=" >-.2f"
        tooltip={(pointObj: any) => {
          console.log(pointObj)
          return(
          <Box bg="white" p={1} shadow="lg">
            <strong>
              {pointObj.point.serieId}<br />
              {pointObj.point.data.xFormatted} : {pointObj.point.data.yFormatted}
            </strong>
          </Box>
          )
        }}
        axisTop={{
          orient: 'top',
          tickSize: 5,
          tickPadding: 15,
          tickRotation: 0,
          legend: '日付',
          legendOffset: -46,
          legendPosition: 'middle',
          //@ts-ignore
          format: function (value: string) {
            return dayjs(value).format('MM/DD')
          } as string,
        }}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 15,
          tickRotation: 0,
          legend: '日付',
          legendOffset: 46,
          legendPosition: 'middle',
          //@ts-ignore
          format: function (value: string) {
            return dayjs(value).format('MM/DD')
          } as string,
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            data: [
              ...props.gds.map((gd) => {
                return {
                  id: gd.id,
                  label: gd.id,
                  color: gd.color,
                  fill: gd.color
                }
              }) as any
            ],
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            itemTextColor: themeText,
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: themeText,
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
      />
    </Box>
  )
}

export default NivoLine