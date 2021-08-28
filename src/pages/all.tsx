import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Box, Heading, Stack } from '@chakra-ui/react';

import { Layout } from '@/components/layout';

import { ConvertedForMultiGraph } from '@/models/index';
import { SITE_DESC } from '@/lib/constants';
import MultipleGraph from '@/components/anime-graph/multiple-animes';

interface AnimesPageProps {
  data: ConvertedForMultiGraph;
}

const ViewAll = ({ data }: AnimesPageProps) => {
  return (
    <>
      <Layout title={`全部表示`} desc={SITE_DESC}>
        <Stack spacing={12}>
          <Heading>全部</Heading>
          <Box>
            {data.byScore ? (
              <>
                <MultipleGraph limit={50} dataForGraph={data} />
              </>
            ) : (
              <Box>FAILED TO FETCH DATA</Box>
            )}
          </Box>
        </Stack>
      </Layout>
    </>
  );
};

export default ViewAll;

export const getServerSideProps: GetServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const limitQuery = query.limit as string | undefined;
  const limit = parseInt(limitQuery ?? '100');
  const apiResult: ConvertedForMultiGraph = await fetch(
    process.env.API_URL + `/apiv4_appv2-getConverted?limit=${limit}`,
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

  return {
    props: {
      limit: limit,
      convertedTime: apiResult.lastConverted ?? null,
      lastGSP: new Date().toUTCString(),
      data: apiResult ?? null,
    },
  };
};
