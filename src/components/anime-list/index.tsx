import { AnimeForGraph } from '@/models/index';
import {
  Box,
  SimpleGrid,
  Stack,
  useDisclosure,
  Flex,
  StatNumber,
  Stat,
  StatHelpText,
} from '@chakra-ui/react';
import Image from 'next/image';
import LinkChakra from '../common/link-chakra';

interface AnimeGraphProps {
  animes: AnimeForGraph[];
}

const AnimeList = ({ animes }: AnimeGraphProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!animes || animes.length < 0) {
    return <Box>DATA IS INVALID</Box>;
  } else {
    return (
      <Stack
        id="a_list"
        style={{ maxWidth: '100vw' }}
        overflowX="scroll"
        spacing={2}
      >
        <Box mb={6} as="h2" fontSize="2rem">
          追跡中のアニメ一覧(スコア順)
        </Box>
        <SimpleGrid spacing={4} minChildWidth="225px">
          {animes.map((anime: AnimeForGraph) => {
            return (
              <LinkChakra
                key={anime.mal_id}
                mb={12}
                href={`/animes/${anime.mal_id}`}
              >
                <Flex h="full" position="relative" w="225px" key={anime.mal_id}>
                  <Box bg="white" roundedTop="lg" overflow="hidden">
                    <Image
                      width="225px"
                      height="318px"
                      objectFit="cover"
                      src={anime.images.jpg.image_url}
                      alt={`${anime.title_japanese}の画像`}
                    />
                  </Box>
                  <Box
                    roundedBottom="lg"
                    bottom={-30}
                    p={2}
                    w="full"
                    bg="white"
                    shadow="lg"
                    position="absolute"
                  >
                    <Stat fontWeight="bold">
                      <StatNumber>{anime.score} / 10</StatNumber>
                      <StatHelpText>{anime.members}人視聴</StatHelpText>
                    </Stat>
                  </Box>
                </Flex>
              </LinkChakra>
            );
          })}
        </SimpleGrid>
      </Stack>
    );
  }
};

export default AnimeList;
