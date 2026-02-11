import { Story } from '../backend';
import { UILanguage } from '../context/PreferencesContext';
import { getStoryContent } from './storyLanguage';

export function translateStoryPlaceholder(story: Story, targetLang: UILanguage) {
  const fallbackContent = getStoryContent(story, 'en');
  
  return {
    ...fallbackContent,
    title: `[Translated] ${fallbackContent.title}`,
    body: `[This is a placeholder translation to ${targetLang}]\n\n${fallbackContent.body}`,
    summary: `[Translated] ${fallbackContent.summary}`,
  };
}
