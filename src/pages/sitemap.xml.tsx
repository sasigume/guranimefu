// https://zenn.dev/catnose99/articles/c441954a987c24

import { SITE_FULL_URL } from "@/lib/constants";
import { AnimeForRss } from "@/models/index";
import { GetServerSidePropsContext } from "next";

async function generateSitemapXml(): Promise<string> {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

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
  allAnimesForRSS.forEach((anime: AnimeForRss) => {
    xml += `
      <url>
        <loc>${SITE_FULL_URL}/animes/${anime.mal_id}</loc>
        <lastmod>${anime.lastFetched}</lastmod>
        <changefreq>weekly</changefreq>
      </url>
    `;
  });

  xml += `</urlset>`;
  return xml;
}

export const getServerSideProps = async ({
  res,
}: GetServerSidePropsContext) => {
  const xml = await generateSitemapXml();
  const revalidate = 86400;

  res.statusCode = 200;
  res.setHeader(
    "Cache-Control",
    `s-maxage=${revalidate}, stale-while-revalidate`
  );
  res.setHeader("Content-Type", "text/xml");
  res.end(xml);

  console.info(
    "\x1b[36m%s\x1b[0m",
    `Sitemap ready, cache expires in ${revalidate}s`
  );

  return {
    props: {},
  };
};

const Page = () => null;
export default Page;
