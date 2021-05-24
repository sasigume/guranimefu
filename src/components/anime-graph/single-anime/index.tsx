import { AnimeForSingle } from "@/models/index";
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import NivoLine from "../nivo/nivo-line";
import GraphWrapper from "../graph-wrapper";

interface Props {
  anime: AnimeForSingle;
}
const SingleAnimeGraph = ({ anime }: Props) => {
  const length = anime.chart_line_popularity.data.length;

  if (!anime.chart_line_popularity || !anime.chart_bump_score) {
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
              <GraphWrapper wBy={40} length={length} title="スコア">
                <NivoLine gds={[anime.chart_line_score]} mode="byscore" />
              </GraphWrapper>
            </TabPanel>
            <TabPanel>
              <GraphWrapper wBy={40} length={length} title="メンバー数">
                <NivoLine
                  gds={[anime.chart_line_popularity]}
                  mode="bypopularity"
                />
              </GraphWrapper>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    );
  }
};

export default SingleAnimeGraph;
