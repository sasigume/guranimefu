import { Box, Divider, Flex } from "@chakra-ui/layout";
import { LayoutProps } from "@chakra-ui/styled-system";
import { ReactNode, useEffect, useRef } from "react";

const GraphWrapper = ({
  children,
  title,
  wBy,
  h,
  length,
}: {
  children: ReactNode;
  title: string;
  wBy?: number;
  h?: LayoutProps["h"];
  length: number;
}) => {
  const endRef = useRef<HTMLDivElement>(null);
  const scrollToButtom = () => {
    endRef.current?.scrollIntoView();
  };
  useEffect(() => {
    scrollToButtom();
  }, [children]);
  return (
    <Box w="full">
      <Box fontSize="1.6rem" mb={4}>
        {title}
      </Box>

      <Flex w="full" overflowX="scroll" h={h ?? "container.xl"}>
        {/* グラフの右にrefがあり、自動でスクロールする */}
        <Box minW={length * (wBy ?? 70)}>{children}</Box>
        <div ref={endRef} />
      </Flex>

      <Divider my={8} />
    </Box>
  );
};

export default GraphWrapper;
