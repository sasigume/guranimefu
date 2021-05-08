import { GetStaticProps } from "next";
import { Box, Divider } from "@chakra-ui/react";

import { Layout } from "@/components/layout";

import { ConvertedForMultiGraph } from "@/models/index";
import AnimeList from "@/components/anime-list";
import { SITE_NAME, SITE_DESC } from "@/lib/constants";
import publishSitemap from "@/lib/sitemap";
import MultipleGraph from "@/components/anime-graph/multiple-animes";

interface AnimesPageProps {
  data: ConvertedForMultiGraph;
  fetchedTime: string;
  lastGSP: Date;
  revalEnv: number;
}

const AnimesPage = ({
  data,
  fetchedTime,
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
          lastFetched: fetchedTime,
          revalidate: revalEnv,
        }}
      >
        <Box>
          {data.byScore && data.byPopularity ? (
            <>
              <MultipleGraph dataForGraph={data} />

              <Divider my={12} />

              <AnimeList animes={data.allAnimes} />

              <Divider my={12} />
            </>
          ) : (
            <Box>FAILED TO FETCH DATA</Box>
          )}
        </Box>
      </Layout>
    </>
  );
};

export default AnimesPage;

export const getStaticProps: GetStaticProps = async () => {
  const apiResult: ConvertedForMultiGraph = await fetch(
    process.env.API_URL + `/vercelapp-getConverted`,
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

  publishSitemap(apiResult.allAnimes ?? []);

  let revalEnv = parseInt(process.env.REVALIDATE ?? "1800");
  return {
    props: {
      fetchedTime: apiResult.lastFetched ?? null,
      lastGSP: new Date().toUTCString(),
      data: apiResult ?? null,
      revalEnv: revalEnv,
    },
    revalidate: revalEnv,
  };
};

/*

export default function AnimesPage() {return <Box>API準備中</Box>}

*/
