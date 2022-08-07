import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

function Header() {
  const session = useSession();

  return (
    <div className='w-full flex justify-between bg-slate-800 text-white p-2'>
      <Link href='/'>
        <h1 className='text-2xl cursor-pointer'>Fake Twitter</h1>
      </Link>
      {session.status === 'authenticated' ? (
        <button
          className='border border-white p-1 hover:bg-slate-700'
          onClick={() => signOut()}
        >
          Log out
        </button>
      ) : (
        <button
          className='border border-white p-1 hover:bg-slate-700'
          onClick={() => signIn()}
        >
          Log in
        </button>
      )}
    </div>
  );
}

export default Header;
