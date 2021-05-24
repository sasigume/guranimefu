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
import GraphWrapper from "../graph-wrapper";
import NivoBump from "../nivo/nivo-bump";
import NivoLine from "../nivo/nivo-line";

interface AnimeGraphProps {
  dataForGraph: ConvertedForMultiGraph;
}

const MultipleGraph = ({ dataForGraph }: AnimeGraphProps) => {
  let length = dataForGraph.sampleLength;

  if (!dataForGraph.byScore || !dataForGraph.byPopularity) {
    return <Box>DATA IS INVALID</Box>;
  } else {
    return (
      <Box id="a_graph" w="full">
        <Tabs>
          <TabList>
            <Tab fontSize="1.8rem">スコア順</Tab>
            <Tab fontSize="1.8rem">メンバー数順</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <GraphWrapper length={length} title="順位推移">
                <NivoBump
                  gds={dataForGraph.byScore.gdsForBump}
                  mode="byscore"
                />
              </GraphWrapper>

              <GraphWrapper length={length} title="数値順位">
                <NivoLine
                  gds={dataForGraph.byScore.gdsForLine}
                  mode="byscore"
                />
              </GraphWrapper>
            </TabPanel>
            <TabPanel>
              <GraphWrapper length={length} title="順位推移">
                <NivoBump
                  gds={dataForGraph.byPopularity.gdsForBump}
                  mode="bypopularity"
                />
              </GraphWrapper>

              <GraphWrapper length={length} title="数値推移">
                <NivoLine
                  gds={dataForGraph.byPopularity.gdsForLine}
                  mode="bypopularity"
                />
              </GraphWrapper>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Divider my={8} />
        <Box fontSize="1rem">
          ※JikanAPIが1日データをキャッシュするので、取得タイミングのせいでグラフが平らになっているかもしれません。
        </Box>
        <Box fontSize="1rem">
          ※同じタイトルでも期が別なら分裂します。(蟲師続章は分裂してる)
        </Box>
        <Box bg="gray.200" p={6} m={6} rounded="xl">
          <Box>集計日数: {length}</Box>
          <Box fontSize="1rem">
            最終グラフ生成日時: {`${dataForGraph.lastConverted}`}
          </Box>
        </Box>
      </Box>
    );
  }
};

export default MultipleGraph;
