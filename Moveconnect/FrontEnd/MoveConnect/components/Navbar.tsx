"use client";

import Link from "next/link";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export function Navbar() {
  const account = useCurrentAccount();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background-dark/80 backdrop-blur-md border-b border-white/10">
      <Link href="/" className="text-xl font-bold text-white tracking-tighter">
        MoveConnect
      </Link>

      <div className="flex items-center gap-4">
        {account && (
          <>
            <Link href="/profile" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Profile
            </Link>
            <Link href="/network" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Network
            </Link>
          </>
        )}
        {/* This button handles Login AND Logout */}
        <ConnectButton />
      </div>
    </nav>
  );
}