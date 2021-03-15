import { GetStaticProps } from 'next'
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

import { FetchedData } from '@/models/index'
import AnimeList from '@/components/anime-list'
import { SITE_NAME, SITE_DESC } from '@/lib/constants'
import publishSitemap from '@/lib/sitemap'
import ConvertForSingle from '@/lib/converter/for-single'
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

      <Box fontSize="1.7rem" mb={2}>{SITE_DESC}</Box>
      <Box fontSize="1rem" mb={4}>
        生成方法は以下の通りです。
        <List listStyleType="decimal" ml={6}>
          <ListItem>Jikan APIから6時間おきにデータ取得</ListItem>
          <ListItem>Firestoreに日付と一緒にデータを保存</ListItem>
          <ListItem>Next.jsのISRで一定期間ごとにページを再生性</ListItem>
          <ListItem>Nivoを使ってグラフ化して表示</ListItem>
        </List>
      </Box>
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

      <List spacing={3} my={0}>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <ChakraLink
            isExternal
            href="https://chakra-ui.com"
            flexGrow={1}
            mr={2}
          >
            Chakra UI <LinkIcon />
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <ChakraLink isExternal href="https://nextjs.org" flexGrow={1} mr={2}>
            Next.js <LinkIcon />
          </ChakraLink>
        </ListItem>
      </List>
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