import { Game } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MessageCircle, Edit, Trash2, Play } from 'lucide-react';
import { useState, useRef } from 'react';

interface GameCardProps {
  game: Game;
  isAdmin?: boolean;
  onEdit?: (game: Game) => void;
  onDelete?: (game: Game) => void;
}

export default function GameCard({ game, isAdmin, onEdit, onDelete }: GameCardProps) {
  const imageUrl = game.image.getDirectURL();
  const priceText = `₹${game.price.toString()}/- only`;
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const platformConfig = {
    pc: { label: 'PC', logo: '/assets/generated/steam-logo.dim_64x64.png', alt: 'Steam' },
    ps5: { label: 'PS5', logo: '/assets/generated/playstation-logo.dim_64x64.png', alt: 'PlayStation' },
    ps4: { label: 'PS4', logo: '/assets/generated/playstation-logo.dim_64x64.png', alt: 'PlayStation' },
    xbox: { label: 'Xbox', logo: '/assets/generated/xbox-logo.dim_64x64.png', alt: 'Xbox' },
  };

  const platformInfo = platformConfig[game.platform];

  const handleBuyNow = () => {
    const message = encodeURIComponent(`Hi! I'm interested in buying ${game.name} for ${priceText}`);
    window.open(`https://wa.me/918757242995?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = () => {
    if (!isAdmin) {
      setShowDetailDialog(true);
    }
  };

  const handlePlayTrailer = () => {
    if (game.trailerVideoUrl) {
      setShowVideo(true);
      // Add autoplay parameter to the URL when user clicks
      setTimeout(() => {
        if (iframeRef.current) {
          const currentSrc = iframeRef.current.src;
          if (!currentSrc.includes('autoplay=1')) {
            const separator = currentSrc.includes('?') ? '&' : '?';
            iframeRef.current.src = `${currentSrc}${separator}autoplay=1`;
          }
        }
      }, 100);
    }
  };

  return (
    <>
      <Card 
        className={`relative bg-white border-2 border-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-80 h-[600px] flex flex-col ${!isAdmin ? 'cursor-pointer' : ''}`}
        onClick={handleCardClick}
      >
        {/* Sale Badge */}
        {game.onSale && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-blue-600 text-white font-bold text-sm px-3 py-1 border-2 border-blue-700">
              SALE!
            </Badge>
          </div>
        )}

        {/* Price Badge - Medium sizing */}
        <div className="absolute top-3 right-3 z-10 bg-blue-600 rounded-lg px-4 py-3 shadow-lg border-2 border-blue-700">
          <p className="text-xl font-bold text-white">{priceText}</p>
        </div>

        {/* Game Image */}
        <div className="relative h-72 bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          {game.trailerVideoUrl && !isAdmin && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="bg-blue-600 rounded-full p-4 opacity-80">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          )}
        </div>

        {/* Game Details */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold text-black line-clamp-2 flex-1">{game.name}</h3>
            <Badge variant="outline" className="border-black text-black flex-shrink-0 flex items-center gap-1.5 px-2 py-1">
              <img 
                src={platformInfo.logo} 
                alt={platformInfo.alt} 
                className="w-4 h-4 object-contain"
              />
              <span>{platformInfo.label}</span>
            </Badge>
          </div>

          <p className="text-sm text-gray-700 mb-3 line-clamp-3 flex-1">{game.description}</p>

          {/* Admin Action Buttons */}
          {isAdmin && (
            <div className="mt-auto flex gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(game);
                }}
                variant="outline"
                className="flex-1 border-black text-black hover:bg-gray-100"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(game);
                }}
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{game.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="border-black text-black flex items-center gap-1.5 px-2 py-1">
                <img 
                  src={platformInfo.logo} 
                  alt={platformInfo.alt} 
                  className="w-4 h-4 object-contain"
                />
                <span>{platformInfo.label}</span>
              </Badge>
              {game.onSale && (
                <Badge className="bg-blue-600 text-white font-bold">
                  SALE!
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Price Display */}
            <div className="bg-blue-600 rounded-lg px-6 py-4 text-center">
              <p className="text-4xl font-bold text-white">{priceText}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{game.description}</p>
            </div>

            {/* Trailer Video */}
            {game.trailerVideoUrl && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Trailer</h3>
                {!showVideo ? (
                  <div 
                    className="relative h-64 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={handlePlayTrailer}
                  >
                    <img
                      src={imageUrl}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                      <div className="bg-blue-600 rounded-full p-6">
                        <Play className="w-12 h-12 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      ref={iframeRef}
                      src={game.trailerVideoUrl}
                      title={`${game.name} trailer`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            )}

            {/* Buy Now Button */}
            <Button
              onClick={handleBuyNow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-xl"
            >
              <MessageCircle className="w-6 h-6 mr-2" />
              Buy Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
