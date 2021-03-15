import { Flex, Heading } from '@chakra-ui/react'
import LinkChakra from '../common/link-chakra'

export const Hero = ({ title }: { title: string }) => (
  <Flex justifyContent="center" alignItems="center" pt={12} pb={8}>
    <Heading fontSize="5vw"><LinkChakra href="/">{title}</LinkChakra></Heading>
  </Flex>
)

Hero.defaultProps = {
  title: 'animegurafu',
}
