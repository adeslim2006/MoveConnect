'use client'

import Link from 'next/link'
import { House, QrCode, User, Envelope, CheckCircle, PlusCircle } from "phosphor-react"
import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'

export default function Profile() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // 1. Fetch Profile Object owned by the current user
  const { data: profileData, isPending } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address || '',
    filter: { StructType: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::moveconnect::Profile` },
    options: { showContent: true }
  });

  // Helper to safely extract fields from the Move object
  // We check if data exists and if it is indeed a Move Object
  const profileObject = profileData?.data?.[0]?.data?.content;
  const profileFields = (profileObject?.dataType === 'moveObject') ? (profileObject.fields as any) : null;

  // 2. Function to Add a Connection
  const handleAddConnection = () => {
    if (!profileFields?.id?.id) return alert("No Profile Found! Please create one first.");
    
    const newContactAddress = prompt("Enter Address to Connect:"); 
    if(!newContactAddress) return;

    const tx = new Transaction();
    
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::moveconnect::add_connection`,
      arguments: [
        tx.object(profileFields.id.id), // Your Profile Object ID
        tx.pure.address(newContactAddress) // The person you scanned
      ]
    });

    signAndExecute({ transaction: tx }, {
      onSuccess: () => alert("Connection Added on-chain!"),
      onError: (err) => console.error(err)
    });
  };

  if (isPending) return <div className="text-white text-center mt-20">Loading Profile from Blockchain...</div>;
  
  // If no profile is found, show a prompt to create one
  if (!isPending && !profileFields) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center text-white">
        <p className="mb-4">No Profile Found.</p>
        <Link href="/profile-setup" className="bg-primary text-black px-4 py-2 rounded-full font-bold">
            Create Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background-dark min-h-screen text-white font-display antialiased pb-32 pt-6 px-4">
      <main className="w-full max-w-[640px] flex flex-col gap-6 mx-auto">

        {/* Identity Card */}
        <div className="glass-panel rounded-2xl overflow-hidden shadow-glass flex flex-col relative">
          {/* Header Image */}
          <div className="h-48 w-full bg-gradient-to-t from-[#0d1929] to-primary/20"></div>

          {/* Avatar & Info */}
          <div className="px-6 pb-8 relative flex flex-col items-center -mt-16">
            <div className="relative w-32 h-32 rounded-full p-1 bg-[#0d1929] border border-white/10 shadow-neon">
              <img 
                src={profileFields?.avatar_url || "https://avatars.githubusercontent.com/u/1"} 
                className="w-full h-full rounded-full object-cover"
                alt="Avatar"
              />
            </div>

            {/* Profile Data from Chain */}
            <div className="mt-4 text-center space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {profileFields?.name || "Anonymous User"}
              </h1>
              <p className="text-sm text-primary opacity-90">
                {profileFields?.bio || "No bio set"}
              </p>
              
              <div className="flex gap-2 justify-center mt-2">
                 <span className="text-xs bg-white/10 px-2 py-1 rounded">{profileFields?.twitter || "@twitter"}</span>
                 <span className="text-xs bg-white/10 px-2 py-1 rounded">{profileFields?.linkedin || "LinkedIn"}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex w-full gap-3 mt-8">
              <button 
                onClick={handleAddConnection}
                className="flex-1 h-11 rounded-full bg-primary text-background-dark font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
              >
                <PlusCircle size={18} weight="bold" />
                Add Connection
              </button>
              <button className="flex-1 h-11 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2">
                <Envelope size={18} weight="bold" />
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle size={18} weight="bold" className="text-primary" />
              Badges & Proofs
            </h2>
          </div>
          <div className="p-4 border border-dashed border-white/20 rounded-xl text-center text-gray-500 text-sm">
            Attend events to earn POAPs and Badges!
          </div>
        </div>

      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-dock rounded-full px-6 py-3 flex items-center gap-8 z-50 bg-black/50 backdrop-blur-lg border border-white/10">
        <Link href="/" className="text-gray-400 hover:text-white"><House size={24} weight="bold" /></Link>
        <Link href="/scanner" className="text-primary hover:scale-110 transition-transform"><QrCode size={32} weight="bold" /></Link>
        <Link href="/profile" className="text-white"><User size={24} weight="bold" /></Link>
      </nav>
    </div>
  )
}