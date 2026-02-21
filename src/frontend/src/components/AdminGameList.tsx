import { useState } from 'react';
import { Game } from '../backend';
import { useGetAllGames, useDeleteGame } from '../hooks/useGames';
import GameCard from './GameCard';
import AdminGameForm from './AdminGameForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

export default function AdminGameList() {
  const { data: games, isLoading } = useGetAllGames();
  const deleteGameMutation = useDeleteGame();
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [deletingGame, setDeletingGame] = useState<Game | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setShowEditDialog(true);
  };

  const handleDelete = (game: Game) => {
    setDeletingGame(game);
  };

  const confirmDelete = async () => {
    if (deletingGame) {
      try {
        await deleteGameMutation.mutateAsync(deletingGame.id);
        setDeletingGame(null);
      } catch (error) {
        console.error('Error deleting game:', error);
        alert('Failed to delete game. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games?.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isAdmin
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <AdminGameForm
        game={editingGame}
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setEditingGame(null);
        }}
      />

      <AlertDialog open={!!deletingGame} onOpenChange={() => setDeletingGame(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Delete Game</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingGame?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-black text-black">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
