import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface UserProfileSetupProps {
  open: boolean;
}

export default function UserProfileSetup({ open }: UserProfileSetupProps) {
  const [name, setName] = useState('');
  const saveProfileMutation = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        await saveProfileMutation.mutateAsync({ name: name.trim() });
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile. Please try again.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-white" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">Welcome!</DialogTitle>
          <DialogDescription>
            Please enter your name to complete your profile setup.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-black font-semibold">Your Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="border-black"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={saveProfileMutation.isPending || !name.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {saveProfileMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Continue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
