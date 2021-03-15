import { GetStaticProps, } from 'next'
import ErrorPage from 'next/error'
import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Box,
  Divider,
} from '@chakra-ui/react'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'
import Head from 'next/head'
import { Layout } from '@/components/layout'
import { AnimeForGraph, FetchedData } from '@/models/index'
import ConvertForList from '@/lib/converter/for-list'
import AnimeSingle from '@/components/anime-single'
import ConvertForSingle from '@/lib/converter/for-single'
import { useRouter } from 'next/dist/client/router'

interface AnimeIDPageProps {
  anime: AnimeForGraph
  fetchedTime: string
  lastGSP: Date
  revalEnv: number
}




const AnimeIDPage = ({ anime, fetchedTime, lastGSP, revalEnv }: AnimeIDPageProps) => {

  let animeConvertedForSingle

  if (anime) {
    animeConvertedForSingle = ConvertForSingle(anime)

    return (<>
      <Layout
        title={anime.title_japanese + 'の詳細情報'} desc={anime.title_japanese + 'の詳細情報'} debugInfo={
          {
            lastGSP: lastGSP,
            lastFetched: fetchedTime,
            revalidate: revalEnv
          }
        }>
        <Box>
          {animeConvertedForSingle ? (
            <>

              <AnimeSingle anime={animeConvertedForSingle} />

            </>) : (
            <Box>FAILED TO FETCH DATA</Box>
          )}
        </Box>
      </Layout>
    </>
    )
  }
  else {
    return (<Layout title={'404 Not found'} desc={''}>
      <ErrorPage title="アニメの情報が見つかりませんでした" statusCode={404} />
    </Layout>)
  }

}

export default AnimeIDPage

export const getStaticProps: GetStaticProps = async (context) => {

  let mal_id
  context.params ? mal_id = context.params.id : mal_id = null

  const secret = process.env.PAGES_MAL_API_SECRET

  const apiResult = await fetch(process.env.HTTPS_URL + `/api/mal/${mal_id}?secret=${secret}&mode=byscore`)
    .then(res => { return res.json() })
    .catch((e) => console.error(e))

  let revalEnv = parseInt(process.env.REVALIDATE ?? '1800')
  return {
    props: {
      fetchedTime: apiResult.lastFetched ?? null,
      lastGSP: new Date().toUTCString(),
      anime: apiResult ?? null,
      revalEnv: revalEnv
    },
    revalidate: revalEnv
  }
}


export async function getStaticPaths() {

  const secret = process.env.PAGES_MAL_API_SECRET

  const apiResult: FetchedData = await fetch(process.env.HTTPS_URL + `/api/mal/getall/?secret=${secret}`)
    .then(res => { return res.json() })
    .catch((e) => console.error(e))

  const paths = ConvertForList(apiResult).map((anime: AnimeForGraph) => `/animes/${anime.mal_id}`)
  return {
    paths: paths,
    fallback: false
  }
}





/*
export default function AnimeIDPage() {return <Box>API準備中</Box>}

*/