'use client'

import { useState } from 'react'
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Generated images for profile
const AVATAR_OPTIONS = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
];

export default function ProfileFlow() {
  const router = useRouter();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  
  const [displayName, setDisplayName] = useState('')
  const [aboutMe, setAboutMe] = useState('')
  const [twitter, setTwitter] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0])

  const createProfileOnChain = () => {
    if (!account) return alert("Please connect your wallet first!");

    const tx = new Transaction();

    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::moveconnect::create_profile`,
      arguments: [
        tx.object(process.env.NEXT_PUBLIC_STATE_ID!), // <--- ADD THIS LINE FIRST!
        tx.pure.string(displayName),
        tx.pure.string(aboutMe),
        tx.pure.string(twitter),
        tx.pure.string(linkedin),
        tx.pure.string(selectedAvatar)
      ],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          alert('Profile Successfully Created!');
          router.push('/profile');
        },
        onError: (err) => {
          console.error('Error:', err);
          alert('Transaction Failed. See console.');
        }
      }
    );
  };

  return (
    <main className="min-h-screen flex justify-center px-4 py-12 bg-background-dark">
      <div className="max-w-2xl w-full flex flex-col gap-8">
        <div className="glass-panel border border-white/10 rounded-3xl p-8 flex flex-col gap-6 shadow-2xl bg-black/40 backdrop-blur-md">
          <h1 className="text-3xl font-bold text-center text-white">Setup Your Identity</h1>
          
          {/* Avatar Selection sections */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium ml-1 text-gray-300">Choose your Avatar</label>
            <div className="grid grid-cols-5 gap-3">
              {AVATAR_OPTIONS.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAvatar(src)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedAvatar === src ? 'border-primary shadow-[0_0_15px_rgba(43,238,121,0.5)] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={src} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Display Name</label>
            <input 
              type="text" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="Satoshi Nakamoto"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Bio</label>
            <textarea 
              value={aboutMe} 
              onChange={(e) => setAboutMe(e.target.value)} 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="@twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"/>
            <input type="text" placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"/>
          </div>

          <button 
            onClick={createProfileOnChain}
            className="w-full bg-primary text-black font-bold px-8 py-4 rounded-full mt-4 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(43,238,121,0.3)]"
          >
            Create Profile
          </button>
        </div>
      </div>
    </main>
  )
}