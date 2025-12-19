'use client'

import { useSuiClientQuery, useCurrentAccount } from '@mysten/dapp-kit'
import { User, RocketLaunch } from "phosphor-react"
import Link from 'next/link'

// Helper Component to Render a Connection 
function UserCard({ address }: { address: string }) {
  // Try to find the profile for this address
  const { data, isPending } = useSuiClientQuery('getOwnedObjects', {
    owner: address,
    filter: { StructType: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::moveconnect::Profile` },
    options: { showContent: true }
  });

  if (isPending) return <div className="animate-pulse h-40 bg-white/5 rounded-2xl"></div>;

  const profileObject = data?.data?.[0]?.data?.content;
  const fields = (profileObject?.dataType === 'moveObject') ? (profileObject.fields as any) : null;

  // If THE address has a Profile then  Show the  full details
  if (fields) {
    return (
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
            <img src={fields.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{fields.name}</h3>
            <p className="text-xs text-primary font-mono">{address.slice(0,6)}...{address.slice(-4)}</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm line-clamp-2">{fields.bio}</p>
      </div>
    );
  }

  // inCase The address has no Profile (Just a raw wallet address) -> then Show generic card
  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center gap-2 border border-white/10 opacity-70">
       <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <User size={20} />
          </div>
          <h3 className="font-bold text-white">Unknown User</h3>
       </div>
       <p className="text-xs text-primary font-mono bg-black/20 p-2 rounded text-center">
         {address.slice(0,6)}...{address.slice(-4)}
       </p>
       <p className="text-xs text-gray-500 text-center">Has not created a profile yet.</p>
    </div>
  );
}

//  Main Page 
export default function NetworkPage() {
  const account = useCurrentAccount();

  // Fetch YOUR Profile to get your connections list
  const { data: myProfileData, isPending } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address || '',
    filter: { StructType: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::moveconnect::Profile` },
    options: { showContent: true }
  });

  // Extracting the 'connections' vector
  const profileObject = myProfileData?.data?.[0]?.data?.content;
  const myConnections = (profileObject?.dataType === 'moveObject') 
    ? (profileObject.fields as any).connections as string[]
    : [];

  if (!account) {
    return <div className="min-h-screen pt-40 text-center text-white">Please Connect Wallet</div>;
  }

  return (
    <main className="min-h-screen bg-background-dark pb-20 px-4">
      <div className="max-w-5xl mx-auto pt-10">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Connections</h1>
            <p className="text-gray-400">People you have added to your network</p>
          </div>
          <Link href="/profile" className="bg-primary text-black px-4 py-2 rounded-full font-bold hover:opacity-90">
             + Add New
          </Link>
        </div>

        {isPending ? (
          <div className="text-center text-gray-500 mt-20">Loading...</div>
        ) : (
          <>
            {myConnections && myConnections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myConnections.map((addr, index) => (
                  <UserCard key={`${addr}-${index}`} address={addr} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass-panel rounded-3xl border border-white/5">
                <RocketLaunch size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-300">No connections yet</h3>
                <p className="text-gray-500 mb-6">Go to your profile to add someone by address!</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}