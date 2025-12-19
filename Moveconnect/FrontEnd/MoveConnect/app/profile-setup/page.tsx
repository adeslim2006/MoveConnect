'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QrCode } from "phosphor-react"
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit' // Updated Hook
import { Transaction } from '@mysten/sui/transactions' // Updated Import
import { useRouter } from 'next/navigation'

export default function ProfileFlow() {
  const router = useRouter();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction(); // Updated Hook Name
  const account = useCurrentAccount();
  
  const [displayName, setDisplayName] = useState('')
  const [aboutMe, setAboutMe] = useState('')
  const [twitter, setTwitter] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [avatar, setAvatar] = useState('https://avatars.githubusercontent.com/u/1?v=4')

  const createProfileOnChain = () => {
    if (!account) return alert("Please connect your wallet first!");

    const tx = new Transaction(); // Updated Class

    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::moveconnect::create_profile`,
      arguments: [
        tx.pure.string(displayName),
        tx.pure.string(aboutMe),
        tx.pure.string(twitter),
        tx.pure.string(linkedin),
        tx.pure.string(avatar)
      ],
    });

    signAndExecute(
      { transaction: tx }, // Updated Property
      {
        onSuccess: (result) => {
          console.log('Profile created:', result);
          alert('Profile Created Successfully!');
          router.push('/profile');
        },
        onError: (err) => {
          console.error('Error:', err);
          alert('Transaction Failed. See console for details.');
        }
      }
    );
  };

  return (
    <div className="bg-background-dark min-h-screen text-white font-display relative">
      <header className="flex items-center justify-between border-b border-glass-border bg-deep-blue/80 backdrop-blur-md px-6 py-4 fixed w-full z-50">
        <Link href="/" className="text-xl font-bold text-white">MoveConnect</Link>
      </header>

      <main className="pt-24 pb-12 px-4 flex justify-center">
        <div className="max-w-4xl w-full flex flex-col lg:flex-row gap-8">
          <div className="flex-1 glass-panel rounded-3xl p-8 flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Create Your Identity</h1>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Display Name</label>
              <input 
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                className="bg-glass-surface border border-glass-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                placeholder="Satoshi Nakamoto"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea 
                value={aboutMe} 
                onChange={(e) => setAboutMe(e.target.value)} 
                className="bg-glass-surface border border-glass-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                placeholder="Building the future..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="@twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="bg-glass-surface border border-glass-border rounded-xl px-4 py-3 text-white"/>
              <input type="text" placeholder="LinkedIn / Social" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="bg-glass-surface border border-glass-border rounded-xl px-4 py-3 text-white"/>
            </div>

            <div className="flex gap-4 mt-4">
              <button 
                onClick={createProfileOnChain}
                className="w-full bg-primary text-background-dark font-bold px-8 py-4 rounded-full hover:shadow-[0_0_20px_rgba(43,238,121,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <QrCode size={20} weight="bold" />
                Mint Profile & Generate QR
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}