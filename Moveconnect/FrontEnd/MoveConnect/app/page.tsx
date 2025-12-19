'use client'

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RocketLaunch } from "phosphor-react"

export default function Home() {
  const account = useCurrentAccount();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      router.push('/profile');
    }
  }, [account, router]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background-dark">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-midnight/90 z-0"></div>
      <div className="absolute inset-0 bg-grid-pattern z-0 opacity-20 pointer-events-none"></div>
      
      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full">
        <div className="glass-card rounded-2xl p-8 sm:p-12 flex flex-col items-center text-center animate-float max-w-[480px] w-full border border-white/10 shadow-2xl backdrop-blur-xl">
          
          {/* Logo */}
          <div className="mb-8 relative size-24 text-white logo-glow">
             <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(43,238,121,0.5)]" fill="none" viewBox="0 0 48 48">
               <path d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="#2bee79" fillRule="evenodd"></path>
             </svg>
          </div>
          
          <h1 className="text-white text-[32px] sm:text-[40px] font-bold mb-2 tracking-tight">
            MoveConnect
          </h1>
          <p className="text-gray-400 mb-10 text-lg">
            Your on-chain professional identity.
          </p>
          
          {/* Login Section */}
          <div className="flex flex-col gap-4 w-full">
            <div className="w-full flex justify-center [&>button]:w-full [&>button]:justify-center [&>button]:h-14 [&>button]:rounded-full [&>button]:text-base [&>button]:font-bold">
              <ConnectButton connectText="Login with Slush Wallet" />
            </div>

            <Link href="/network" className="flex w-full items-center justify-center rounded-full h-14 border border-white/10 text-gray-300 font-bold hover:bg-white/5 transition-all">
              <RocketLaunch size={24} weight="bold" className="mr-2" />
              Explore Network
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}