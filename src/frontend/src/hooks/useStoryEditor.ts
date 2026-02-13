import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { ExternalBlob } from '../backend';
import { addGuestStory } from '../lib/userStoriesStorage';

interface CreateStoryData {
  text: string;
  image?: File;
}

export function useStoryEditor() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const createMutation = useMutation({
    mutationFn: async (data: CreateStoryData) => {
      if (!data.text.trim()) {
        throw new Error('Story text cannot be empty');
      }

      if (isAuthenticated && actor) {
        // Authenticated mode - save to backend
        let imageBlob: ExternalBlob | null = null;
        
        if (data.image) {
          const bytes = new Uint8Array(await data.image.arrayBuffer());
          imageBlob = ExternalBlob.fromBytes(bytes);
        }

        const draftId = await actor.addStoryDraft(data.text, imageBlob);
        return { id: draftId.toString(), mode: 'authenticated' };
      } else {
        // Guest mode - save to localStorage
        let imageDataUrl: string | undefined;
        
        if (data.image) {
          imageDataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(data.image!);
          });
        }

        const id = addGuestStory(data.text, imageDataUrl);
        return { id, mode: 'guest' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myStories'] });
    },
  });

  return {
    createStory: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
