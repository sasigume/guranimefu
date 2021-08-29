import { SITE_DESC, SITE_NAME } from '@/lib/constants';
import { Flex, Heading, Box } from '@chakra-ui/react';
import LinkChakra from '../common/link-chakra';
import Logo from '../common/logo';

export const Hero = () => (
  <Flex
    border="none"
    borderBottom="solid"
    borderWidth={2}
    borderColor="gray.400"
    direction={{ base: 'column', md: 'row' }}
    justifyContent="space-between"
    alignItems="center"
    pt={12}
    pb={8}
    mb={4}
    gridGap={3}
  >
    <Box>
      <Logo />
      <Heading as="h1">GURANIMEFU</Heading>
    </Box>

    <Box fontSize="1.4rem">{SITE_DESC}</Box>
  </Flex>
);
