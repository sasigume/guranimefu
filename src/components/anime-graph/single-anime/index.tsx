import ConvertForMultiGraph from "@/lib/converter/for-multi-graph";
import { AnimeForSingle, FetchedData } from "@/models/index";
import { ConvertedForMultiGraph } from "@/models/index";
import {
  Box,
  Divider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import NivoBump from "../nivo/nivo-bump";
import NivoLine from "../nivo/nivo-line";

interface Props {
  anime: AnimeForSingle;
}
const SingleAnimeGraph = ({ anime }: Props) => {
  const length = anime.gdsForLinePop[0].data.length;

  if (!anime.gdsForLinePop || !anime.gdsForLineScore) {
    return <Box>DATA IS INVALID</Box>;
  } else {
    return (
      <Box style={{ maxWidth: "100vw" }} overflowX="scroll">
        <Tabs>
          <TabList>
            <Tab fontSize="2rem">スコア</Tab>
            <Tab fontSize="2rem">メンバー数</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box fontSize="1.8rem">スコア</Box>
              <>
                <Box w={length * 50} h="3000px" position="static">
                  <NivoLine gds={anime.gdsForLineScore} mode="byscore" />
                </Box>
                <Divider my={16} />
              </>
            </TabPanel>
            <TabPanel>
              <Box fontSize="1.8rem">メンバー数</Box>

              <>
                <Box w={length * 50} h="3000px" position="static">
                  <NivoLine gds={anime.gdsForLinePop} mode="bypopularity" />
                </Box>
              </>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    );
  }
};

export default SingleAnimeGraph;
