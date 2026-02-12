import { useState, useEffect } from 'react';
import { getStorySocialData, addComment as addCommentToStorage, toggleLikeOverlay, Comment } from '../lib/storySocialStorage';

export function useStorySocial(storyId: string) {
  const [socialData, setSocialData] = useState(() => getStorySocialData(storyId));

  useEffect(() => {
    setSocialData(getStorySocialData(storyId));
  }, [storyId]);

  const toggleLike = () => {
    const newOverlay = toggleLikeOverlay(storyId);
    setSocialData(prev => ({ ...prev, likeOverlay: newOverlay }));
  };

  const addComment = (author: string, text: string) => {
    addCommentToStorage(storyId, author, text);
    setSocialData(getStorySocialData(storyId));
  };

  return {
    likeOverlay: socialData.likeOverlay,
    comments: socialData.comments,
    toggleLike,
    addComment,
  };
}
