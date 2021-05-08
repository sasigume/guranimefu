import ConvertForMultiGraph from "@/lib/converter/for-multi-graph";
import { FetchedData } from "@/models/index";
import { ConvertedForMultiGraph } from "@/models/index";
import {
  Box,
  Divider,
  Flex,
  LayoutProps,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useRef } from "react";
import NivoBump from "../nivo/nivo-bump";
import NivoLine from "../nivo/nivo-line";

interface AnimeGraphProps {
  dataFromFirebase: FetchedData;
}

const MultipleGraph = ({ dataFromFirebase }: AnimeGraphProps) => {
  const dataForGraph: ConvertedForMultiGraph = ConvertForMultiGraph(
    dataFromFirebase
  );

  let length = dataForGraph.sampleLength;

  const GraphWrapper = ({
    children,
    title,
    h,
  }: {
    children: ReactNode;
    title: string;
    h?: LayoutProps["h"];
  }) => {
    const endRef = useRef<HTMLDivElement>(null);
    const scrollToButtom = () => {
      endRef.current?.scrollIntoView();
    };
    useEffect(() => {
      scrollToButtom();
    }, [dataForGraph]);
    return (
      <Box w="full">
        <Box fontSize="1.6rem" mb={4}>
          {title}
        </Box>

        <Flex w="full" overflowX="scroll" h={h ?? "container.xl"}>
          {/* グラフの右にrefがあり、自動でスクロールする */}
          <Box minW={length * 70}>{children}</Box>
          <div ref={endRef} />
        </Flex>

        <Divider my={8} />
      </Box>
    );
  };

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
              <GraphWrapper title="順位推移">
                <NivoBump
                  gds={dataForGraph.byScore.gdsForBump}
                  mode="byscore"
                />
              </GraphWrapper>

              <GraphWrapper title="順位推移">
                <NivoBump
                  gds={dataForGraph.byScore.gdsForBump}
                  mode="byscore"
                />
              </GraphWrapper>

              <GraphWrapper title="数値順位">
                <NivoLine
                  gds={dataForGraph.byScore.gdsForLine}
                  mode="byscore"
                />
              </GraphWrapper>
            </TabPanel>
            <TabPanel>
              <GraphWrapper title="順位推移">
                <NivoBump
                  gds={dataForGraph.byPopularity.gdsForBump}
                  mode="bypopularity"
                />
              </GraphWrapper>

              <GraphWrapper title="数値推移">
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
          <Box fontSize="1.3rem" fontWeight="bold">
            バグってるので無視したデータ: {dataForGraph.ignoredDates.join(" ")}
          </Box>
          <Box>集計日数: {length}</Box>
          <Box fontSize="1rem">
            最終グラフ生成日時: {`${dataFromFirebase.lastFetched}`}
          </Box>
        </Box>
      </Box>
    );
  }
};

export default MultipleGraph;
