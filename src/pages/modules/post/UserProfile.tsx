import Image from 'next/future/image';
import { inferQueryOutput } from '../../../utils/trpc';
import defaultAvatar from '../post/default-avatar.jpeg';
import PostList from './PostList';

type UserProfileProps = {
  user: inferQueryOutput<'user.findOne'>;
};

function UserProfile(props: UserProfileProps) {
  // get posts

  return (
    <div className='flex flex-col'>
      <div className='flex'>
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
