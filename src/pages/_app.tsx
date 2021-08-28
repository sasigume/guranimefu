import { AppProps } from 'next/app';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
dayjs.locale('ja');

import { Chakra } from '@/components/providers/chakra';

function App({ Component, pageProps }: AppProps) {
  return (
    <Chakra cookies={pageProps.cookies}>
      <Component {...pageProps} />
    </Chakra>
  );
}

export default App;

// https://chakra-ui.com/docs/features/color-mode
export { getServerSideProps } from '@/components/providers/chakra';
