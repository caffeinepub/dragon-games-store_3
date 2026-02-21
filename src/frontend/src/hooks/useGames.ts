import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Game, Platform } from '../backend';

export function useGetAllGames() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Game[]>({
    queryKey: ['games'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGames();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetGame(id: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Game | null>({
    queryKey: ['game', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getGame(id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useGetGamesByPlatform(platform: Platform) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Game[]>({
    queryKey: ['games', 'platform', platform],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGamesByPlatform(platform);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetOnSaleGames() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Game[]>({
    queryKey: ['games', 'onSale'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOnSaleGames();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (game: Game) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGame(game);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}

export function useUpdateGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, game }: { id: string; game: Game }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGame(id, game);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}

export function useDeleteGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGame(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}
