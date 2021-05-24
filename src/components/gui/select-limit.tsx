import { Button } from "@chakra-ui/button";
import { Stack } from "@chakra-ui/layout";
import { Slider, SliderTrack, SliderThumb } from "@chakra-ui/slider";
import { useState } from "react";
import LinkChakra from "../common/link-chakra";

const SelectLimit = () => {
  const [limit, setLimit] = useState(0);
  const handleChange = (value: number) => {
    setLimit(value);
  };
  return (
    <Stack spacing={4}>
      <Slider
        defaultValue={0}
        onChange={handleChange}
        onChangeEnd={handleChange}
        max={100}
        min={0}
      >
        <SliderTrack>
          <SliderThumb />
        </SliderTrack>
      </Slider>
      <Button as={LinkChakra} href={`/all?limit=${limit}`}>
        {limit}日分のデータを読む
      </Button>
    </Stack>
  );
};

export default SelectLimit;
