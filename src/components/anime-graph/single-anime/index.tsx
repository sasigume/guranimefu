import { AnimeForSingle } from "@/models/jikan_v4";
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import NivoLine from "../nivo/nivo-line";
import GraphWrapper from "../graph-wrapper";

interface Props {
  anime: AnimeForSingle;
}
const SingleAnimeGraph = ({ anime }: Props) => {
  const length = anime.chart_line_score?.data.length;

  if (!anime.chart_bump_score) {
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
              <GraphWrapper wBy={40} length={length ?? 50} title="スコア">
                {anime.chart_line_score && (
                  <NivoLine gds={[anime.chart_line_score]} mode="byscore" />
                )}
              </GraphWrapper>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    );
  }
};

export default SingleAnimeGraph;
