import { GetStaticProps } from 'next';
import { Box, Divider, Heading, Stack } from '@chakra-ui/react';

import { Layout } from '@/components/layout';

import { ConvertedForMultiGraph } from '@/models/index';
import AnimeList from '@/components/anime-list';
import { SITE_NAME, SITE_DESC } from '@/lib/constants';
import MultipleGraph from '@/components/anime-graph/multiple-animes';
import SelectLimit from '@/components/gui/select-limit';

interface AnimesPageProps {
  data: ConvertedForMultiGraph;
  convertedTime: Date;
  lastGSP: string;
  revalEnv: number;
}

const AnimesPage = ({
  data,
  convertedTime,
  lastGSP,
  revalEnv,
}: AnimesPageProps) => {
  return (
    <>
      <Layout
        isIndex
        title={SITE_NAME}
        desc={SITE_DESC}
        debugInfo={{
          lastGSP: lastGSP,
          lastFetched: convertedTime,
          revalidate: revalEnv,
        }}
      >
        <Stack spacing={12}>
          <Box>
            <Heading as="h2">読み込み件数を変更</Heading>
            <SelectLimit />
          </Box>
          <Stack spacing={6}>
            <Heading as="h2">最新のデータ</Heading>
            {data.byScore ? (
              <>
                <MultipleGraph dataForGraph={data} />

                <Divider my={12} />
              </>
            ) : (
              <Box>FAILED TO FETCH DATA</Box>
            )}
          </Stack>

          {data.allAnimes.length > 0 && <AnimeList animes={data.allAnimes} />}
        </Stack>
      </Layout>
    </>
  );
};

export default AnimesPage;

export const getStaticProps: GetStaticProps = async () => {
  const apiResult: ConvertedForMultiGraph = await fetch(
    process.env.API_URL + `/apiv4_appv2-getConverted?limit=30`,
    {
      headers: {
        authorization: process.env.FUNCTION_AUTH ?? '',
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .catch((e) => console.error(e));

  let revalEnv = parseInt(process.env.REVALIDATE ?? '1800');
  return {
    props: {
      convertedTime: apiResult.lastConverted ?? null,
      lastGSP: new Date().toUTCString(),
      data: apiResult ?? null,
      revalEnv: revalEnv,
    },
    revalidate: revalEnv,
  };
};
