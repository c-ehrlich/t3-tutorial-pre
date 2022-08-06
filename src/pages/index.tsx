import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { trpc } from '../utils/trpc';
import CreatePost from './modules/post/CreatePost';
import PostList from './modules/post/PostList';
import PublicTimeline from './modules/post/PublicTimeline';

const Home: NextPage = () => {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Twitter Clone</title>
        <meta name='description' content='T3 Tutorial' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>{session ? <LoggedInIndex /> : <div>logged out</div>}</main>
    </>
  );
};

export default Home;

function LoggedInIndex() {
  return (
    <>
      <CreatePost />
      <PublicTimeline />
    </>
  );
}
