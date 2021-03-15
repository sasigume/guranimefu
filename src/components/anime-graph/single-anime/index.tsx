import ConvertForMultiGraph from "@/lib/converter/for-multi-graph"
import { AnimeForSingle, FetchedData } from '@/models/index'
import { ConvertedForMultiGraph } from "@/models/index"
import { Box, Divider, Tab, TabList, TabPanel, TabPanels, Tabs, } from "@chakra-ui/react"
import NivoBump from "../nivo/nivo-bump"
import NivoLine from "../nivo/nivo-line"

interface Props {
  anime: AnimeForSingle
}
const SingleAnimeGraph = ({ anime }: Props) => {

  const length = anime.gdsForLinePop[0].data.length

  if (!anime.gdsForLinePop || !anime.gdsForLineScore) {
    return <Box>DATA IS INVALID</Box>
  } else {

    

    return (
      <Box style={{ maxWidth: "100vw" }} overflowX="scroll">
        <Box fontSize="1rem">※JikanAPIが1日データをキャッシュするので、取得タイミングのせいでグラフが平らになっているかもしれません。</Box>
        <Divider my={8} />
        <Tabs>
          <TabList>
            <Tab fontSize="2rem">スコア順</Tab>
            <Tab fontSize="2rem">メンバー数順</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box fontSize="1.8rem">スコア順</Box>
              <>
                <Box w={length * 50} h="container.xl" position="static">
                  <Box fontSize="1.8rem">数値推移</Box>
                  <NivoLine gds={anime.gdsForLineScore} mode="byscore" />
                </Box>
                <Divider my={16} />
              </>

            </TabPanel>
            <TabPanel>
              <Box fontSize="1.8rem">メンバー数順</Box>

              <>
                <Box w={length * 50} h="container.xl" position="static">
                  <Box fontSize="1.6rem">数値推移</Box>
                  <NivoLine gds={anime.gdsForLinePop} mode="bypopularity" />
                </Box>
              </>

            </TabPanel>
          </TabPanels>
        </Tabs>

      </Box>
    )
  }
}

export default SingleAnimeGraph