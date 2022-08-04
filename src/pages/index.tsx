import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const hello = trpc.proxy.example.hello.useQuery({ text: 'from tRPC' });

  return (
    <>
      <Head>
        <title>Twitter Clone</title>
        <meta name='description' content='T3 Tutorial' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main></main>
    </>
  );
};

export default Home;

// Technology component
interface TechnologyCardProps {
  name: string;
  description: string;
  documentation: string;
}

const TechnologyCard = ({
  name,
  description,
  documentation,
}: TechnologyCardProps) => {
  return (
    <section className='flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105'>
      <h2 className='text-lg text-gray-700'>{name}</h2>
      <p className='text-sm text-gray-600'>{description}</p>
      <a
        className='mt-3 text-sm underline text-violet-500 decoration-dotted underline-offset-2'
        href={documentation}
        target='_blank'
        rel='noreferrer'
      >
        Documentation
      </a>
    </section>
  );
};
