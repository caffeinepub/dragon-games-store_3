import { Game } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Edit, Trash2 } from 'lucide-react';

interface GameCardProps {
  game: Game;
  isAdmin?: boolean;
  onEdit?: (game: Game) => void;
  onDelete?: (game: Game) => void;
}

export default function GameCard({ game, isAdmin, onEdit, onDelete }: GameCardProps) {
  const imageUrl = game.image.getDirectURL();
  const priceText = `₹${game.price.toString()}/- only`;

  const platformLabels = {
    pc: 'PC',
    ps5: 'PS5',
    ps4: 'PS4',
    xbox: 'Xbox',
  };

  const handleBuyNow = () => {
    const message = encodeURIComponent(`Hi! I'm interested in buying ${game.name} for ${priceText}`);
    window.open(`https://wa.me/918757242995?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="relative bg-white border-2 border-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-80 h-[520px] flex flex-col">
      {/* Sale Badge */}
      {game.onSale && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-blue-600 text-white font-bold text-sm px-3 py-1 border-2 border-blue-700">
            SALE!
          </Badge>
        </div>
      )}

      {/* Price Badge */}
      <div className="absolute top-3 right-3 z-10 bg-white border-2 border-black rounded-lg px-3 py-2 shadow-md">
        <p className="text-xl font-bold text-black">{priceText}</p>
      </div>

      {/* Game Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={game.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Game Details */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-bold text-black line-clamp-2 flex-1">{game.name}</h3>
          <Badge variant="outline" className="border-black text-black flex-shrink-0">
            {platformLabels[game.platform]}
          </Badge>
        </div>

        <p className="text-sm text-gray-700 mb-3 line-clamp-3 flex-1">{game.description}</p>

        {/* Trailer Video */}
        {game.trailerVideoUrl && (
          <div className="mb-3">
            <div className="aspect-video bg-gray-100 rounded border border-gray-300 overflow-hidden">
              <iframe
                src={game.trailerVideoUrl}
                title={`${game.name} trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto space-y-2">
          {!isAdmin && (
            <Button
              onClick={handleBuyNow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Buy Now
            </Button>
          )}

          {isAdmin && (
            <div className="flex gap-2">
              <Button
                onClick={() => onEdit?.(game)}
                variant="outline"
                className="flex-1 border-black text-black hover:bg-gray-100"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => onDelete?.(game)}
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
