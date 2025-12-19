'use client'

import Link from 'next/link'
import { RocketLaunch } from "phosphor-react"
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const account = useCurrentAccount();
  const router = useRouter();

  // Auto-redirect if wallet is connected
  useEffect(() => {
    if (account) {
      router.push('/profile');
    }
  }, [account, router]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-midnight/90 z-0"></div>
      <div className="absolute inset-0 bg-grid-pattern z-0 opacity-50 pointer-events-none"></div>
      
      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        <div className="glass-card rounded-2xl p-8 sm:p-12 flex flex-col items-center text-center animate-float max-w-[480px] w-full">
          
          {/* Logo */}
          <div className="mb-8 relative size-20 text-white logo-glow">
             <svg className="w-full h-full" fill="none" viewBox="0 0 48 48">
               <path d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="#2bee79" fillRule="evenodd"></path>
             </svg>
          </div>
          
          <h1 className="text-white text-[32px] sm:text-[40px] font-bold mb-3">
            MoveConnect
          </h1>
          <p className="text-gray-300 mb-10">
            Your on-chain professional identity.
          </p>
          
          {/* Login / Connect Section */}
          <div className="flex flex-col gap-4 w-full">
            {/* The dApp Kit Connect Button handles ALL wallet logic (Sui Wallet, zkLogin, etc.) */}
            <div className="w-full flex justify-center [&>button]:w-full [&>button]:justify-center [&>button]:h-14 [&>button]:rounded-full [&>button]:bg-primary [&>button]:text-black [&>button]:font-bold">
              <ConnectButton />
            </div>

            <Link href="/network" className="flex w-full items-center justify-center rounded-full h-14 border border-primary/30 text-white font-bold hover:bg-primary/5 transition-all">
              <RocketLaunch size={24} weight="bold" className="mr-2" />
              Explore Network
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}