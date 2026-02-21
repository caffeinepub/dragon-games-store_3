import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminGameList from '../components/AdminGameList';
import AdminGameForm from '../components/AdminGameForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Admin Panel</h1>
            <p className="text-gray-600 mt-1">Manage your game catalog</p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Game
          </Button>
        </div>

        <AdminGameList />

        <AdminGameForm
          game={null}
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
