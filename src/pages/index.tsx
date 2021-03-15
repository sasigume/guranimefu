import { GetStaticProps } from 'next'
import {
  Box,
  Divider,
} from '@chakra-ui/react'

import { Layout } from '@/components/layout'

import { FetchedData } from '@/models/index'
import AnimeList from '@/components/anime-list'
import { SITE_NAME, SITE_DESC } from '@/lib/constants'
import publishSitemap from '@/lib/sitemap'
import ConvertForList from '@/lib/converter/for-list'
import MultipleGraph from '@/components/anime-graph/multiple-animes'


interface AnimesPageProps {
  fetchedData: FetchedData
  fetchedTime: string
  lastGSP: Date
  revalEnv: number
}

const AnimesPage = ({ fetchedData, fetchedTime, lastGSP, revalEnv }: AnimesPageProps) => {

  return (<>
    <Layout isIndex title={SITE_NAME} desc={SITE_DESC} debugInfo={
      {
        lastGSP: lastGSP,
        lastFetched: fetchedTime,
        revalidate: revalEnv
      }
    }>

      <Box>
        {(fetchedData.animesByScore && fetchedData.animesByPopularity) ? (
          <>

            <MultipleGraph dataFromFirebase={fetchedData} />

            <Divider my={12} />

            <AnimeList dataFromFirebase={fetchedData} />

            <Divider my={12} />
          </>) : (
          <Box>FAILED TO FETCH DATA</Box>
        )}
      </Box>
    </Layout>
  </>
  )
}

export default AnimesPage

export const getStaticProps: GetStaticProps = async () => {

  const secret = process.env.PAGES_MAL_API_SECRET

  const apiResult = await fetch(process.env.HTTPS_URL + `/api/mal/getall/?secret=${secret}`)
    .then(res => { return res.json() })
    .catch((e) => console.error(e))

  const convertedAnimes = ConvertForList(apiResult)

  publishSitemap(convertedAnimes)

  let revalEnv = parseInt(process.env.REVALIDATE ?? '1800')
  return {
    props: {
      fetchedTime: apiResult.lastFetched ?? null,
      lastGSP: new Date().toUTCString(),
      fetchedData: apiResult ?? null,
      revalEnv: revalEnv
    },
    revalidate: revalEnv
  }
}


/*

export default function AnimesPage() {return <Box>API準備中</Box>}

*/