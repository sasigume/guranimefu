import { AnimeForGraphWithLastFetched } from "@/models/jikan_v4";
import {
  Box,
  SimpleGrid,
  Stack,
  //useDisclosure,
  Flex,
  StatNumber,
  Stat,
  StatHelpText,
} from "@chakra-ui/react";
import LinkChakra from "../common/link-chakra";

interface AnimeGraphProps {
  animes: AnimeForGraphWithLastFetched[];
}

const AnimeList = ({ animes }: AnimeGraphProps) => {
  //const { isOpen, onOpen, onClose } = useDisclosure();

  if (!animes || animes.length < 0) {
    return <Box>DATA IS INVALID</Box>;
  } else {
    return (
      <Stack
        id="a_list"
        style={{ maxWidth: "100vw" }}
        overflowX="scroll"
        spacing={2}
      >
        <Box mb={6} as="h2" fontSize="2rem">
          追跡中のアニメ一覧(スコア順)
        </Box>
        <SimpleGrid spacing={4} minChildWidth="135px">
          {animes.map((anime: AnimeForGraphWithLastFetched) => {
            return (
              <LinkChakra
                key={anime.mal_id}
                mb={12}
                href={`/animes/${anime.mal_id}`}
              >
                <Flex h="full" position="relative" w="135px" key={anime.mal_id}>
                  <Box roundedTop="lg" overflow="hidden">
                    <img
                      style={{ width: "135px", height: "auto" }}
                      src={anime.images.jpg.image_url}
                    />
                  </Box>
                  <Box
                    roundedBottom="lg"
                    bottom={-30}
                    p={2}
                    w="full"
                    shadow="lg"
                    bg="white"
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
