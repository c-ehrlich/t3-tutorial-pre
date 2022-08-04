import { GetServerSideProps } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  LiteralUnion,
  signIn,
} from 'next-auth/react';

export default function SignInPage(props: {
  // DURING VIDEO SHOW OFF INFERGETSERVERSIDEPROPSTYPE
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}) {
  if (!props.providers) return <div>No auth providers found</div>;

  return (
    <div className='w-screen min-h-screen bg-slate-800 flex flex-col gap-4 justify-center items-center'>
      <h2 className='text-white text-4xl'>Welcome to the custom login page</h2>
      {Object.values(props.providers).map((provider) => (
        <button
          className='bg-white hover:bg-slate-200 p-2'
          key={provider.id}
          onClick={() => signIn(provider.id)}
        >
          Log in with {provider.name}
        </button>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {},
    };
  }

  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};
