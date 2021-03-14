import LinkChakra from '@/components/common/link-chakra'
import { CONST_REPO_URL } from '@/lib/constants'
import { Link as ChakraLink, Button, Flex, Center, Container, Stack } from '@chakra-ui/react'

// CTA stands for Call To Action
export const CTA = () => (
  <Flex
    justifyContent="center"
    position="fixed"
    bottom="0"
    width="full"
  >
    <Container maxW="container.md" p={2} roundedTop="xl" shadow="xl" bg="white">
      <Stack spacing={3} h={12} direction="row">
        <LinkChakra flexGrow={1} href="#a_graph"><Button w="full" h="full" colorScheme="pink">グラフ</Button></LinkChakra>
        <LinkChakra flexGrow={2} href="#a_list"><Button w="full" h="full" colorScheme="purple">アニメ一覧</Button></LinkChakra>
        <LinkChakra flexGrow={2} href="https://myanimelist.net"><Button w="full" h="full" colorScheme="blue">データ取得元</Button></LinkChakra>
      </Stack>
    </Container>
  </Flex>
)
