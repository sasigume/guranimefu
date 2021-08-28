import { AnimeForSingle } from '@/models/index';
import { Button } from '@chakra-ui/button';
import { Box, Divider, Flex, List, ListItem } from '@chakra-ui/layout';
import { Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/stat';
import Image from 'next/image';
import dayjs from 'dayjs';
import SingleAnimeGraph from '../anime-graph/single-anime';
import LinkChakra from '../common/link-chakra';

interface Props {
  anime: AnimeForSingle;
}

const AnimeSingle = ({ anime }: Props) => {
  return (
    <Box>
      <Box as="h2" fontSize="2rem" fontWeight="bold">
        {anime.title_japanese} ({anime.title})
      </Box>
      <Divider my={6} />
      <Box as="h3" mb={4} fontSize="1.7rem" fontWeight="bold">
        詳細情報
      </Box>
      <Flex direction={{ base: 'column', md: 'row' }}>
        <Box mr={8}>
          <Image
            width="424px"
            height="600px"
            src={anime.images.jpg.large_image_url ?? anime.images.jpg.image_url}
            alt={`${anime.title_japanese}の画像`}
          />
        </Box>
        <Box>
          <Stat my={6}>
            <StatLabel>スコア</StatLabel>
            <StatNumber>{anime.score}</StatNumber>
            <StatHelpText>{anime.scored_by}人が評価</StatHelpText>
          </Stat>
          <List mb={4}>
            <ListItem>{anime.members}人が視聴</ListItem>
            <ListItem>{anime.favorites}人がお気に入りに登録</ListItem>
            <ListItem>
              {dayjs(anime.aired.from).format('YYYY年MM月')}放送開始
            </ListItem>
            <ListItem>
              {dayjs(anime.aired.to).format('YYYY年MM月')}放送終了
            </ListItem>
          </List>
          <LinkChakra isExternal target="_blank" href={anime.url}>
            <Button colorScheme="blue">MyAnimeListで詳細を見る</Button>
          </LinkChakra>
        </Box>
      </Flex>
      <Divider my={6} />
      <Box as="h3" fontSize="1.7rem" fontWeight="bold">
        グラフ
      </Box>

      <SingleAnimeGraph anime={anime} />
    </Box>
  );
};

export default AnimeSingle;
