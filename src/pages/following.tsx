import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import GetPosts from '../modules/post/GetPosts';

const Home: NextPage = () => {
  const session = useSession();

  return <main>{session ? <LoggedInFollow /> : <div>logged out</div>}</main>;
};

export default Home;

function LoggedInFollow() {
  return <GetPosts isFollowing />;
}
