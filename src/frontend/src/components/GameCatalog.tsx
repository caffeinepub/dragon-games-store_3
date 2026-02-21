import { useState } from 'react';
import { useGetAllGames } from '../hooks/useGames';
import GameCard from './GameCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';

export default function GameCatalog() {
  const { data: games, isLoading, error } = useGetAllGames();
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 font-semibold">Error loading games. Please try again later.</p>
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">No games available yet. Check back soon!</p>
      </div>
    );
  }

  // Filter games based on search query
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group games into rows of 4
  const rows: typeof filteredGames[] = [];
  for (let i = 0; i < filteredGames.length; i += 4) {
    rows.push(filteredGames.slice(i, i + 4));
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">Our Game Collection</h2>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search for games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Game Results */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No games found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-8">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex}>
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-6 pb-4">
                    {row.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
