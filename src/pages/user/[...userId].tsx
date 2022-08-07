import { NextPage } from 'next';
import { useRouter } from 'next/router';
import UserProfile from '../../modules/post/UserProfile';

const Home: NextPage = () => {
  const router = useRouter();
  let { userId } = router.query;

  if (Array.isArray(userId)) {
    userId = userId[0];
  }

  if (!userId) {
    return <div>user not found</div>;
  }

  return <UserProfile userId={userId} />;
};

export default Home;
