import { useSession } from 'next-auth/react';
import Image from 'next/future/image';
import { trpc } from '../../utils/trpc';
import defaultAvatar from '../post/default-avatar.jpeg';
import CreatePost from './CreatePost';
import GetPosts from './GetPosts';

type UserProfileProps = {
  userId: string;
};

function UserProfile(props: UserProfileProps) {
  const { data: session } = useSession();

  const {
    data: user,
    isLoading,
    isError,
    error,
    errorUpdateCount,
  } = trpc.proxy.user.findOne.useQuery(
    { id: props.userId },
    {
      retry: (_failureCount, error) => {
        if (error.data.code === 'NOT_FOUND') {
          return false;
        }

        return true;
      },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error?.data.code === 'NOT_FOUND') {
    return <div>This user doesnt exist</div>;
  }

  if (isError || !user) {
    console.log('errorUpdateCount: ' + errorUpdateCount);
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <div className='flex flex-col'>
      <div className='flex gap-2'>
        <Image
          className='rounded'
          src={user.image || defaultAvatar}
          alt={`${user.name}'s avatar`}
          width={128}
          height={128}
          priority
        />
        <div className='flex flex-col'>
          <div>{user.name}</div>
          <div>Joined on {user.createdAt.toLocaleDateString()}</div>
        </div>
      </div>

      {session?.user?.id && user.id === session?.user?.id && <CreatePost />}

      <GetPosts userId={user.id} />
    </div>
  );
}

export default UserProfile;
