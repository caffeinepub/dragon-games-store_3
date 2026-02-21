import { useState, useRef, useEffect } from 'react';
import { useGetAllGames } from '../hooks/useGames';
import GameCard from './GameCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GameCatalog() {
  const { data: games, isLoading, error } = useGetAllGames();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollStates, setScrollStates] = useState<{ [key: number]: { atStart: boolean; atEnd: boolean } }>({});

  const updateScrollState = (index: number) => {
    const scrollContainer = scrollRefs.current[index];
    if (!scrollContainer) return;

    const atStart = scrollContainer.scrollLeft <= 0;
    const atEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1;

    setScrollStates(prev => ({
      ...prev,
      [index]: { atStart, atEnd }
    }));
  };

  useEffect(() => {
    // Initialize scroll states for all rows
    scrollRefs.current.forEach((_, index) => {
      updateScrollState(index);
    });
  }, [games, searchQuery]);

  const handleScroll = (index: number, direction: 'left' | 'right') => {
    const scrollContainer = scrollRefs.current[index];
    if (!scrollContainer) return;

    const scrollAmount = 350; // Slightly more than card width (320px) + gap
    const newScrollLeft = direction === 'left' 
      ? scrollContainer.scrollLeft - scrollAmount 
      : scrollContainer.scrollLeft + scrollAmount;

    scrollContainer.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    // Update scroll state after animation
    setTimeout(() => updateScrollState(index), 300);
  };

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
              <div key={rowIndex} className="relative group">
                {/* Left Arrow */}
                {row.length > 1 && !scrollStates[rowIndex]?.atStart && (
                  <Button
                    onClick={() => handleScroll(rowIndex, 'left')}
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-black hover:bg-gray-100 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-6 h-6 text-black" />
                  </Button>
                )}

                {/* Right Arrow */}
                {row.length > 1 && !scrollStates[rowIndex]?.atEnd && (
                  <Button
                    onClick={() => handleScroll(rowIndex, 'right')}
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-black hover:bg-gray-100 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-6 h-6 text-black" />
                  </Button>
                )}

                <ScrollArea className="w-full whitespace-nowrap">
                  <div 
                    ref={(el) => {
                      scrollRefs.current[rowIndex] = el;
                    }}
                    className="flex gap-6 pb-4"
                    onScroll={() => updateScrollState(rowIndex)}
                  >
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
