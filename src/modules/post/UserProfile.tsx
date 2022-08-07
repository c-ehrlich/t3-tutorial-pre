import { useSession } from 'next-auth/react';
import Image from 'next/future/image';
import { json } from 'stream/consumers';
import { trpc } from '../../utils/trpc';
import defaultAvatar from '../post/default-avatar.jpeg';
import CreatePost from './CreatePost';
import GetPosts from './GetPosts';

type UserProfileProps = {
  userId: string;
};

function UserProfile(props: UserProfileProps) {
  const { data: session } = useSession();
  const queryClient = trpc.useContext();

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

  console.log(user?.followers[0]);

  const isFollowing =
    session?.user && user?.followers[0]?.followerId === session.user.id;
  console.log(isFollowing);

  const followMutation = trpc.proxy.user.follow.useMutation({
    onMutate: () => {
      const user = queryClient.getQueryData([
        'user.findOne',
        { id: props.userId },
      ]);

      if (user) {
        user._count.followers += 1;
        user.followers[0] = { followerId: session?.user?.id ?? '' };

        queryClient.setQueryData(['user.findOne', { id: props.userId }], user);
      }
    },
    onError: (err) => console.error(err),
    onSettled: () => {
      queryClient.invalidateQueries(['user.findOne', { id: props.userId }]);
    },
  });

  function handleFollow() {
    followMutation.mutate({ id: props.userId });
  }

  // TODO - implement unfollow useMutation
  function handleUnfollow() {}

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
          <div>Followers: {user._count.followers}</div>
          <div>Following: {user._count.following}</div>
          <div>Posts: {user._count.posts}</div>
        </div>
        {session?.user && (
          <button
            className='border border-black px-2 py-2 hover:bg-slate-200'
            onClick={
              isFollowing ? () => handleUnfollow() : () => handleFollow()
            }
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      {session?.user?.id && user.id === session?.user?.id && <CreatePost />}

      <GetPosts userId={user.id} />
    </div>
  );
}

export default UserProfile;
