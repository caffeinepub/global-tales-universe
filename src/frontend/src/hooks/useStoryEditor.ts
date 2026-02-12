import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetStoryById } from './useStories';
import { Story } from '../backend';

interface StoryFormData {
  title: string;
  category: string;
  content: string;
  summary: string;
  coverUrl: string;
  readTime: number;
  language: string;
}

export function useStoryEditor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data: StoryFormData) => {
      if (!actor) throw new Error('Not authenticated');
      
      // Check if backend supports story creation
      if (typeof actor.publishStory !== 'function') {
        throw new Error('Story creation is not available yet');
      }

      // For now, we'll just show a message that this feature is coming soon
      throw new Error('Story creation feature is coming soon!');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['myStories'] });
    },
  });

  const loadStory = async (storyId: bigint): Promise<Story | null> => {
    if (!actor) return null;
    try {
      const story = await actor.getStory(storyId);
      return story;
    } catch (error) {
      console.error('Failed to load story:', error);
      return null;
    }
  };

  return {
    loadStory,
    saveStory: saveMutation.mutateAsync,
    isLoading: false,
    isSaving: saveMutation.isPending,
  };
}
