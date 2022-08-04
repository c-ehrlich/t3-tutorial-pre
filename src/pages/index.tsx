import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import CreatePost from './modules/post/CreatePost';

const Home: NextPage = () => {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Twitter Clone</title>
        <meta name='description' content='T3 Tutorial' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>{session && <CreatePost />}</main>
    </>
  );
};

export default Home;
