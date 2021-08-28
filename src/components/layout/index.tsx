import { Flex, useColorMode, Box, Container } from '@chakra-ui/react';
import Head from 'next/head';
import { ReactNode } from 'react';
import { Hero } from './Hero';
import LayoutDrawer from './layout-drawer';
import { CTA } from './CTA';
import Meta from './meta';
import { SITE_NAME } from '@/lib/constants';

interface LayoutProps {
  title: string;
  desc: string;
  children: ReactNode;
  debugInfo?: {
    lastGSP: string;
    lastFetched: Date;
    revalidate?: number;
  };
  isIndex?: boolean;
}

export const Layout = ({
  title,
  desc,
  children,
  debugInfo,
  isIndex,
}: LayoutProps) => {
  const { colorMode } = useColorMode();

  const bgColor = { light: 'gray.50', dark: 'gray.900' };

  const color = { light: 'black', dark: 'white' };

  return (
    <Box style={{ width: '100vw' }}>
      <Meta title={title} desc={desc} />
      <Flex
        w="full"
        direction="column"
        alignItems="center"
        justifyContent="center"
        bg={bgColor[colorMode]}
        color={color[colorMode]}
      >
        <Head>
          <title>
            {title}
            {!isIndex ? ' | ' + SITE_NAME : ''}
          </title>
        </Head>
        <Container maxW="container.xl" pb={8}>
          <Hero />

          {children}
        </Container>
      </Flex>

      <LayoutDrawer>
        <Box>
          デバッグ(revalidate): {debugInfo?.revalidate ?? 'ISRではありません'}
        </Box>
        <Box>デバッグ(lastGSP): {debugInfo?.lastGSP ?? null}</Box>
        <Box>
          デバッグ(lastFetched):{' '}
          {JSON.stringify(debugInfo?.lastFetched) ?? null}
        </Box>
      </LayoutDrawer>

      <CTA />

      <Flex w="full" as="footer" pt={8} pb={20}>
        <Container>
          <Box>
            Code of the app is distributed under MIT Lisence. The site owner do
            not own these anime stats or images.
          </Box>
        </Container>
      </Flex>
    </Box>
  );
};
