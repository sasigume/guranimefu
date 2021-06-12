import { AnimeForSingle } from "@/models/jikan_v4";
import {
  Button,
  Box,
  Divider,
  Heading,
  Flex,
  List,
  ListItem,
  Stack,
  Spacer,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import SingleAnimeGraph from "../anime-graph/single-anime";
import LinkChakra from "../common/link-chakra";

interface Props {
  anime: AnimeForSingle;
}

const AnimeSingle = ({ anime }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Stack as="article" spacing={4}>
        <Flex justifyContent="space-between">
          <Box>
            <Heading as="h1" fontSize="2rem" fontWeight="bold">
              {anime.title_japanese}
            </Heading>
            <Text fontSize="1.4rem" color="gray.800">
              {anime.title}
            </Text>
          </Box>
          <Box>
            <LinkChakra isExternal target="_blank" href={anime.url}>
              <Button colorScheme="blue">MyAnimeListで詳細を見る</Button>
            </LinkChakra>
          </Box>
        </Flex>
        <Flex flexWrap="wrap" gridGap={2}>
          {anime.airing ? (
            <Badge colorScheme="green">放送中</Badge>
          ) : (
            <Badge>放送終了</Badge>
          )}
          {anime.genres.map((g) => (
            <Badge>{g.name}</Badge>
          ))}
        </Flex>

        <Divider my={6} />
        <Flex
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
        >
          <Box minW="315px" mr={8}>
            <img
              style={{ width: "full" }}
              src={anime.images.jpg.large_image_url}
            />
          </Box>
          <Stack flexGrow={1} spacing={8}>
            <Box>
              <Stat mb={3}>
                <StatLabel>スコア</StatLabel>
                <StatNumber>{anime.score}</StatNumber>
                <StatHelpText>
                  {anime.rank}位 / {anime.scored_by}人が評価
                </StatHelpText>
              </Stat>

              <List>
                <ListItem>{anime.members}人が視聴</ListItem>
                <ListItem>{anime.favorites}人がお気に入りに登録</ListItem>
              </List>
            </Box>
            <Box>
              <Heading as="h2" fontSize="1.4rem" fontWeight="bold">
                {anime.type == "TV" ? "放送" : "公開"}情報
              </Heading>

              <List>
                <ListItem>
                  {anime.year && <span>{anime.year}年</span>}
                  {anime.season && <span>{anime.season}アニメ</span>}
                </ListItem>
                {anime.type == "TV" && anime.broadcast.string && (
                  <ListItem>
                    放送スケジュール: {anime.broadcast.string}
                  </ListItem>
                )}

                {anime.aired.from && (
                  <ListItem>
                    {dayjs(anime.aired.from).format("YYYY年MM月")}
                    {anime.type == "TV" ? "放送" : "公開"}開始
                  </ListItem>
                )}
                {anime.aired.to && (
                  <ListItem>
                    {dayjs(anime.aired.to).format("YYYY年MM月")}放送終了
                  </ListItem>
                )}
              </List>
            </Box>
            <Box>
              <Heading as="h2" fontSize="1.4rem" fontWeight="bold">
                制作・製作
              </Heading>
              <List>
                {anime.producers.map((p) => (
                  <ListItem>
                    <a href={p.url} target="_blank">
                      {p.name}
                    </a>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box>
              <Heading as="h2" fontSize="1.4rem" fontWeight="bold">
                英語の説明文
              </Heading>
              <Box>{anime.synopsis}</Box>
              {anime.background && <Box>{anime.background}</Box>}
            </Box>

            <Spacer />
            <Box>
              最終更新:{" "}
              {dayjs(anime.lastFetched._seconds * 1000).format(
                "YYYY/MM/DD HH:mm:ss"
              )}
            </Box>
            <Box>
              <Button onClick={onOpen} colorScheme="green">
                JSONデータを見る
              </Button>
            </Box>
          </Stack>
        </Flex>

        <Divider my={6} />
        <Box as="h2" fontSize="1.7rem" fontWeight="bold">
          グラフ
        </Box>

        <SingleAnimeGraph anime={anime} />
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="100vw" maxW="100vw" overflowX="scroll">
          <ModalCloseButton />
          <ModalHeader>JSON (ID: {anime.mal_id})</ModalHeader>
          <ModalBody>
            <Box mb={4}>
              <pre>https://api.jikan.moe/v4/anime/{anime.mal_id}</pre>{" "}
              で当日分のデータが取得できます。過去のグラフデータは当サイトが生成したものです。
            </Box>
            <pre>{JSON.stringify(anime, null, `\t`)}</pre>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AnimeSingle;
