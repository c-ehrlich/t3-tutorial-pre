import { useSession } from 'next-auth/react';
import Image from 'next/future/image';
import { inferQueryOutput } from '../../../utils/trpc';
import defaultAvatar from '../post/default-avatar.jpeg';
import CreatePost from './CreatePost';
import PostList from './PostList';

type UserProfileProps = {
  user: inferQueryOutput<'user.findOne'>;
};

function UserProfile(props: UserProfileProps) {
  const { data: session } = useSession();
  // get posts

  return (
    <div className='flex flex-col'>
      <div className='flex gap-2'>
        <Image
          className='rounded'
          src={props.user.image || defaultAvatar}
          alt={`${props.user.name}'s avatar`}
          width={128}
          height={128}
        />
        <div className='flex flex-col'>
          <div>{props.user.name}</div>
          <div>Joined on {props.user.createdAt.toLocaleDateString()}</div>
        </div>
      </div>

      {session?.user?.id && props.user.id === session?.user?.id && (
        <CreatePost />
      )}

      {/* posts, use props.user.posts until we have the current value */}

      <PostList
        posts={props.user.posts.map((post) => {
          return {
            ...post,
            author: {
              name: props.user.name,
              image: props.user.image,
            },
          };
        })}
      />
    </div>
  );
}

export default UserProfile;
