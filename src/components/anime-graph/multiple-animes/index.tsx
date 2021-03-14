import ConvertForMultiGraph from "@/lib/converter/for-multi-graph"
import { FetchedData } from '@/models/index'
import { ConvertedForMultiGraph } from "@/models/index"
import { Box, Divider, Tab, TabList, TabPanel, TabPanels, Tabs, } from "@chakra-ui/react"
import NivoBump from "../nivo/nivo-bump"
import NivoLine from "../nivo/nivo-line"

interface AnimeGraphProps {
  dataFromFirebase: FetchedData
}

const MultipleGraph = ({ dataFromFirebase }: AnimeGraphProps) => {

  const dataForGraph: ConvertedForMultiGraph = ConvertForMultiGraph(dataFromFirebase)

  let length = dataForGraph.sampleLength

  if (!dataForGraph.byScore || !dataForGraph.byPopularity) {
    return <Box>DATA IS INVALID</Box>
  } else {

    return (
      <Box id="a_graph" style={{ maxWidth: "100vw" }} overflowX="scroll">
        
        <Tabs>
          <TabList>
            <Tab fontSize="1.8rem">スコア順</Tab>
            <Tab fontSize="1.8rem">メンバー数順</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box fontSize="1.8rem">スコア順</Box>
              <>
                <Box w={length * 80} h="container.xl" position="static">
                  <Box fontSize="1.6rem">順位推移</Box>

                  <NivoBump gds={dataForGraph.byScore.gdsForBump} mode="byscore" />
                </Box>
                <Divider my={8} />
              </>

              <>
                <Box w={length * 80} h="container.xl" position="static">
                  <Box fontSize="1.8rem">数値推移</Box>
                  <NivoLine gds={dataForGraph.byScore.gdsForLine} mode="byscore" />
                </Box>
                <Divider my={16} />
              </>

            </TabPanel>
            <TabPanel>
              <Box fontSize="1.8rem">メンバー数順</Box>

              <>
                <Box w={length * 80} h="container.xl" position="static">
                  <Box fontSize="1.6rem">順位推移</Box>

                  <NivoBump gds={dataForGraph.byPopularity.gdsForBump} mode="bypopularity" />
                </Box>
                <Divider my={8} />
              </>

              <>
                <Box w={length * 80} h="container.xl" position="static">
                  <Box fontSize="1.6rem">数値推移</Box>
                  <NivoLine gds={dataForGraph.byPopularity.gdsForLine} mode="bypopularity" />
                </Box>
              </>

            </TabPanel>
          </TabPanels>
        </Tabs>
        <Divider my={8} />
        <Box fontSize="1rem">※JikanAPIが1日データをキャッシュするので、取得タイミングのせいでグラフが平らになっているかもしれません。</Box>
        <Box fontSize="1rem">※同じタイトルでも期が別なら分裂します。</Box>
        <Box bg="gray.200" p={6} m={6} rounded="xl">
          <Box fontSize="1.3rem" fontWeight="bold">IGNORED DATA: {dataForGraph.ignoredDates.join(' ')}</Box>
          <Box>Length: {length}</Box>
          <Box fontSize="1rem">Fetched: {(`${dataFromFirebase.lastFetched}`)}</Box>
        </Box>
      </Box>
    )
  }
}

export default MultipleGraph