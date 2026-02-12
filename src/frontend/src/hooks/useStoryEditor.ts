import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useStory } from './useStories';
import { Story } from '../backend';
import { saveStoryTags } from '../lib/storyDraft';

interface StoryFormData {
  id: bigint | null;
  title: string;
  category: string;
  language: string;
  content: string;
  summary: string;
  coverImageUrl: string;
  readTimeMinutes: number;
  tags: string[];
}

export function useStoryEditor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadStory = async (storyId: bigint): Promise<Story | null> => {
    if (!actor) return null;
    setIsLoading(true);
    try {
      const story = await actor.getStory(storyId);
      return story;
    } catch (error) {
      console.error('Failed to load story:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveStory = async (data: StoryFormData): Promise<void> => {
    if (!actor) {
      throw new Error('Actor not available');
    }

    setIsSaving(true);
    try {
      // Check if backend supports user story creation
      const hasPublishStory = typeof (actor as any).publishStory === 'function';
      const hasUpdateStory = typeof (actor as any).updateStory === 'function';

      if (data.id && hasUpdateStory) {
        // Update existing story
        await (actor as any).updateStory(
          data.id,
          data.title,
          data.content,
          data.summary,
          data.category,
          data.language,
          BigInt(data.readTimeMinutes),
          data.coverImageUrl
        );
      } else if (!data.id && hasPublishStory) {
        // Create new story
        const storyId = await (actor as any).publishStory(
          false, // isKidFriendly - default to false for user stories
          data.category,
          'User', // author - will be replaced by backend with actual user
          BigInt(data.readTimeMinutes),
          false, // isPremium - default to false for user stories
          data.coverImageUrl,
          { title: data.title, body: data.content, summary: data.summary },
          { title: '', body: '', summary: '' }, // Tamil - empty for now
          { title: '', body: '', summary: '' }  // Hindi - empty for now
        );

        // Save tags locally
        if (data.tags.length > 0) {
          saveStoryTags(storyId.toString(), data.tags);
        }
      } else {
        throw new Error('Story management is not yet available. Please contact support.');
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['myStories'] });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: ['story', data.id.toString()] });
      }
    } catch (error: any) {
      console.error('Failed to save story:', error);
      
      // Parse authorization errors
      if (error.message?.includes('Unauthorized') || error.message?.includes('Only admins')) {
        throw new Error('You do not have permission to create or edit stories. This feature is coming soon!');
      }
      
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    loadStory,
    saveStory,
    isLoading,
    isSaving,
  };
}
