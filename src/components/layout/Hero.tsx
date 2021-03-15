import { SITE_DESC, SITE_NAME } from '@/lib/constants'
import { Flex, Heading, Box } from '@chakra-ui/react'
import LinkChakra from '../common/link-chakra'

export const Hero = () => (
  <Flex border="none" borderBottom="solid" borderWidth={2} borderColor="gray.400" direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems="center" pt={12} pb={8} mb={4}>
    <Heading as="h1" mr={4} fontSize={{ base: "3rem", md: "2rem" }}>
      <LinkChakra href="/">{SITE_NAME}</LinkChakra>
    </Heading>
    <Box fontSize="1.4rem">{SITE_DESC}</Box>
  </Flex>
)