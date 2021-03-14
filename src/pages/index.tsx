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
      <Text mb={8}>
        Built with <Code>Next.js</Code> + <Code>chakra-ui</Code> + <Code>firebase</Code> + <Code>nivo</Code> +{' '}
        <Code>typescript</Code>.
      </Text>

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