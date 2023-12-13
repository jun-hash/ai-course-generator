import React from 'react'
import Link from "next/link";
import { getAuthSession } from '@/lib/auth';
import SingInButton from './SignInButton';
import UserAccountNav from './UserAccountNav' ;

type Props = {}

const Navbar = async (props: Props) => {
  const session = await getAuthSession()

  return (
    <nav className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
      
      <div className="flex items-center justify-center h-full gap-2 px-8 mx-auto sm:justify-between max-w-7xl">
        {/* Nav Title */}
        <Link href="/gallery" className="items-center hidden gap-2 sm:flex">
          <p className ="rounded-lg border-2 border-b-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
            Learning Journey YT
          </p>
        </Link>

        {/* Nav sublinks */}
        <div className='flex items-center'>
            <Link href="/gallery" className="mr-3">
              Gallery
            </Link>
        </div>
        <div className="flex items-center">
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              <SingInButton />
            )}
          </div>
      </div>


    </nav>
  )
}


export default Navbar