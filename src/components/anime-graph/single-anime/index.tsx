import { AnimeForSingle } from '@/models/index';
import { Box } from '@chakra-ui/react';
import NivoLine from '../nivo/nivo-line';
import GraphWrapper from '../graph-wrapper';

interface Props {
  anime: AnimeForSingle;
}
const SingleAnimeGraph = ({ anime }: Props) => {
  const length = anime.chart_bump_score.data.length;

  if (!anime.chart_bump_score) {
    return <Box>DATA IS INVALID</Box>;
  } else {
    return (
      <Box style={{ maxWidth: '100vw' }} overflowX="scroll">
        <GraphWrapper wBy={40} length={length} title="スコア">
          <NivoLine gds={[anime.chart_line_score]} mode="byscore" />
        </GraphWrapper>
      </Box>
    );
  }
};

export default SingleAnimeGraph;
