import { useState, useEffect } from 'react';
import { Game, Platform, ExternalBlob } from '../backend';
import { useAddGame, useUpdateGame } from '../hooks/useGames';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface AdminGameFormProps {
  game?: Game | null;
  open: boolean;
  onClose: () => void;
}

export default function AdminGameForm({ game, open, onClose }: AdminGameFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    trailerVideoUrl: '',
    platform: Platform.pc,
    onSale: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const addGameMutation = useAddGame();
  const updateGameMutation = useUpdateGame();

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name,
        price: game.price.toString(),
        description: game.description,
        trailerVideoUrl: game.trailerVideoUrl || '',
        platform: game.platform,
        onSale: game.onSale,
      });
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        trailerVideoUrl: '',
        platform: Platform.pc,
        onSale: false,
      });
      setImageFile(null);
    }
    setUploadProgress(0);
  }, [game, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!game && !imageFile) {
      alert('Please select an image');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let imageBlob: ExternalBlob;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else {
        imageBlob = game!.image;
      }

      const gameData: Game = {
        id: game?.id || `game-${Date.now()}`,
        name: formData.name,
        price: BigInt(formData.price),
        description: formData.description,
        image: imageBlob,
        trailerVideoUrl: formData.trailerVideoUrl || undefined,
        platform: formData.platform,
        onSale: formData.onSale,
      };

      if (game) {
        await updateGameMutation.mutateAsync({ id: game.id, game: gameData });
      } else {
        await addGameMutation.mutateAsync(gameData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving game:', error);
      alert('Failed to save game. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const isLoading = addGameMutation.isPending || updateGameMutation.isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">
            {game ? 'Edit Game' : 'Add New Game'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-black font-semibold">Game Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border-black"
            />
          </div>

          <div>
            <Label htmlFor="price" className="text-black font-semibold">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="border-black"
            />
          </div>

          <div>
            <Label htmlFor="platform" className="text-black font-semibold">Platform *</Label>
            <Select
              value={formData.platform}
              onValueChange={(value) => setFormData({ ...formData, platform: value as Platform })}
            >
              <SelectTrigger className="border-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Platform.pc}>PC</SelectItem>
                <SelectItem value={Platform.ps5}>PlayStation 5</SelectItem>
                <SelectItem value={Platform.ps4}>PlayStation 4</SelectItem>
                <SelectItem value={Platform.xbox}>Xbox</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-black font-semibold">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="border-black"
            />
          </div>

          <div>
            <Label htmlFor="image" className="text-black font-semibold">
              Game Image {!game && '*'}
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!game}
              className="border-black"
            />
            {game && !imageFile && (
              <p className="text-sm text-gray-600 mt-1">Leave empty to keep current image</p>
            )}
          </div>

          <div>
            <Label htmlFor="trailerVideoUrl" className="text-black font-semibold">
              Trailer Video URL (YouTube embed)
            </Label>
            <Input
              id="trailerVideoUrl"
              type="url"
              value={formData.trailerVideoUrl}
              onChange={(e) => setFormData({ ...formData, trailerVideoUrl: e.target.value })}
              placeholder="https://www.youtube.com/embed/..."
              className="border-black"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="onSale"
              checked={formData.onSale}
              onCheckedChange={(checked) => setFormData({ ...formData, onSale: checked })}
            />
            <Label htmlFor="onSale" className="text-black font-semibold cursor-pointer">
              On Sale
            </Label>
          </div>

          {isUploading && uploadProgress > 0 && (
            <div className="space-y-2">
              <Label className="text-black font-semibold">Upload Progress</Label>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600">{uploadProgress}%</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-black text-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {game ? 'Update Game' : 'Add Game'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
