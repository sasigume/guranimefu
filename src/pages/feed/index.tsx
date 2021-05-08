// https://zenn.dev/catnose99/articles/c7754ba6e4adac

import { SITE_DESC, SITE_FULL_URL, SITE_NAME } from "@/lib/constants";
import { AnimeForRss } from "@/models/index";
import { GetServerSidePropsContext } from "next";
import RSS from "rss";

const TOTAL_LIMIT = parseInt(process.env.TOTAL_PAGINATION ?? "600");

async function generateFeedXml() {
  const feed = new RSS({
    title: SITE_NAME,
    description: SITE_DESC,
    site_url: SITE_FULL_URL,
    feed_url: SITE_FULL_URL + "/feed",
    language: "ja",
  });

  let allAnimesForRSS = [];
  const allAnimesForRSSRes = await fetch(
    `${process.env.API_URL}/vercelapp-getRss`,
    {
      headers: {
        authorization: process.env.FUNCTION_AUTH ?? "",
      },
    }
  );
  if (allAnimesForRSSRes.ok) {
    allAnimesForRSS = await allAnimesForRSSRes.json();
  }
  allAnimesForRSS?.forEach((anime: AnimeForRss) => {
    feed.item({
      title: anime.title,
      author: "MyAnimeList",
      description: anime.description ?? "",
      date: new Date(anime.lastFetched),
      url: `${process.env.HTTPS_URL}/animes/${anime.mal_id}`,
    });
  });

  return feed.xml({ indent: true });
}

export const getServerSideProps = async ({
  res,
}: GetServerSidePropsContext) => {
  const xml = await generateFeedXml();
  const revalidate = 86400;

  res.statusCode = 200;
  res.setHeader(
    "Cache-Control",
    `s-maxage=${revalidate}, stale-while-revalidate`
  );
  res.setHeader("Content-Type", "text/xml");
  res.end(xml);

  return {
    props: {},
  };
};

const Page = () => null;
export default Page;
