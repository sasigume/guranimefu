import { ConvertedForMultiGraph } from '@/models/index';
import { Badge, Box, Divider } from '@chakra-ui/react';
import { useMemo } from 'react';
import GraphWrapper from '../graph-wrapper';
import NivoBump from '../nivo/nivo-bump';
import NivoLine from '../nivo/nivo-line';

interface AnimeGraphProps {
  dataForGraph: ConvertedForMultiGraph;
  limit?: number;
}

const MultipleGraph = ({ dataForGraph, limit }: AnimeGraphProps) => {
  let length = dataForGraph.sampleLength;

  const MemoScoreBump = useMemo(
    () => (
      <GraphWrapper length={length} title="順位推移">
        <NivoBump gds={dataForGraph.byScore.gdsForBump} mode="byscore" />
      </GraphWrapper>
    ),
    [length, dataForGraph.byScore.gdsForBump]
  );
  const MemoScoreLine = useMemo(
    () => (
      <GraphWrapper length={length} title="数値順位">
        <NivoLine gds={dataForGraph.byScore.gdsForLine} mode="byscore" />
      </GraphWrapper>
    ),
    [length, dataForGraph.byScore.gdsForLine]
  );

  if (!dataForGraph.byScore) {
    return <Box>DATA IS INVALID</Box>;
  } else {
    return (
      <Box id="a_graph" w="full">
        <Box>
          <Box>2021/08/29: データをリセットして収集をやり直しました。</Box>
          <Badge>{length}日分のデータが見つかりました。</Badge>
          {limit && (
            <Badge colorScheme="red">
              そのうち最大{limit}日分を表示しています。
            </Badge>
          )}
        </Box>
        <Box>
          {MemoScoreBump}
          {MemoScoreLine}
        </Box>
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
