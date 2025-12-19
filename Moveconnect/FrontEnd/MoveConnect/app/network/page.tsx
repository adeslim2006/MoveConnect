'use client'

import { useSuiClientQuery } from '@mysten/dapp-kit'
import { User, RocketLaunch } from "phosphor-react"

// --- 1. Helper Component to Fetch & Render Individual Profiles ---
function UserCard({ address }: { address: string }) {
  // Fetch the Profile object owned by this specific address
  const { data, isPending } = useSuiClientQuery('getOwnedObjects', {
    owner: address,
    filter: { StructType: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::moveconnect::Profile` },
    options: { showContent: true }
  });

  if (isPending) return <div className="animate-pulse h-64 bg-white/5 rounded-2xl"></div>;

  const profileObject = data?.data?.[0]?.data?.content;
  const fields = (profileObject?.dataType === 'moveObject') ? (profileObject.fields as any) : null;

  if (!fields) return null; // Don't show if they don't have a profile yet

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/10 hover:border-primary/50 transition-all group">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-primary transition-colors">
          <img 
            src={fields.avatar_url} 
            alt={fields.name}
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "https://avatars.githubusercontent.com/u/1?v=4" }}
          />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white">{fields.name}</h3>
          <p className="text-xs text-primary font-mono">{address.slice(0,6)}...{address.slice(-4)}</p>
        </div>
      </div>
      
      <p className="text-gray-400 text-sm line-clamp-2 min-h-[40px]">{fields.bio}</p>

      <div className="flex gap-2 mt-auto">
        {fields.twitter && (
           <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-gray-400">@{fields.twitter}</span>
        )}
      </div>
    </div>
  );
}

// --- 2. Main Page Component ---
export default function NetworkPage() {
  // Fetch the shared "State" object that contains the list of users
  const { data: stateData, isPending } = useSuiClientQuery('getObject', {
    id: process.env.NEXT_PUBLIC_STATE_ID!,
    options: { showContent: true }
  });

  const stateContent = stateData?.data?.content;
  // Safely extract the 'users' array from the move object
  const userList = (stateContent?.dataType === 'moveObject') 
    ? (stateContent.fields as any).users as string[]
    : [];

  return (
    <main className="min-h-screen bg-background-dark pb-20 px-4">
      <div className="max-w-5xl mx-auto pt-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Global Network</h1>
            <p className="text-gray-400">Discover other professionals on MoveConnect</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            <RocketLaunch size={32} weight="duotone" />
          </div>
        </div>

        {/* Content Area */}
        {isPending ? (
          <div className="text-center text-gray-500 mt-20">Loading Network...</div>
        ) : (
          <>
            {userList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 3. Map over the list of addresses from the State object */}
                {userList.map((addr) => (
                  <UserCard key={addr} address={addr} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass-panel rounded-3xl border border-white/5">
                <User size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-300">No users found</h3>
                <p className="text-gray-500">Be the first to create a profile!</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}