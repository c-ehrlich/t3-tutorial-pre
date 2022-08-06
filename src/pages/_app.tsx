// src/pages/_app.tsx
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppType } from 'next/dist/shared/lib/utils';
import { trpc } from '../utils/trpc';
import Header from './modules/header/Header';
import { useRouter } from 'next/router';
import { ReactQueryDevtools } from 'react-query/devtools';

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  const fullScreen = ['/signin'].includes(router.pathname);

  return (
    <SessionProvider session={pageProps.session}>
      <ReactQueryDevtools />
      {!fullScreen && <Header />}
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
