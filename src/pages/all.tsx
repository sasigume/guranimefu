import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Box, Heading } from "@chakra-ui/react";

import { Layout } from "@/components/layout";

import { ConvertedForMultiGraph } from "@/models/index";
import { SITE_DESC } from "@/lib/constants";
import MultipleGraph from "@/components/anime-graph/multiple-animes";

interface AnimesPageProps {
  data: ConvertedForMultiGraph;
  convertedTime: string;
  lastGSP: Date;
  limit: number;
}

const ViewAll = ({ data, convertedTime, lastGSP, limit }: AnimesPageProps) => {
  return (
    <>
      <Layout
        title={`最新${limit}件のデータ`}
        desc={SITE_DESC}
        debugInfo={{
          lastGSP: lastGSP,
          lastFetched: convertedTime,
        }}
      >
        <Heading>最新{limit}件のデータ</Heading>
        <Box>
          {data.byScore && data.byPopularity ? (
            <>
              <MultipleGraph dataForGraph={data} />
            </>
          ) : (
            <Box>FAILED TO FETCH DATA</Box>
          )}
        </Box>
      </Layout>
    </>
  );
};

export default ViewAll;

export const getServerSideProps: GetServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const limitQuery = query.limit as string | undefined;
  const limit = parseInt(limitQuery ?? "100");
  const apiResult: ConvertedForMultiGraph = await fetch(
    process.env.API_URL + `/vercelapp_v2-getConverted?limit=${limit}`,
    {
      headers: {
        authorization: process.env.FUNCTION_AUTH ?? "",
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
