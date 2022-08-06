import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import UserProfile from '../modules/post/UserProfile';

const Home: NextPage = () => {
  const router = useRouter();
  let { userId } = router.query;

  if (Array.isArray(userId)) {
    userId = userId[0];
  }

  if (!userId) {
    return <div>user not found</div>;
  }

  // TODO hand this down to a separate component so this hook is stable

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = trpc.proxy.user.findOne.useQuery({ id: userId });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return <UserProfile user={user} />;
};

export default Home;
