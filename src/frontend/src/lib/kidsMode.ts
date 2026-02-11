export const MATURE_CATEGORIES = ['Romance', 'Horror', 'Thriller'];
export const KIDS_CATEGORIES = ['Fairy Tales', 'Educational', 'Superhero', 'Adventure', 'Comedy', 'Family', 'Motivational', 'Poems'];

export function isKidsSafe(category: string): boolean {
  return !MATURE_CATEGORIES.includes(category);
}

export function getFilteredCategories(isKidsMode: boolean): string[] {
  const allCategories = [
    'Romance', 'Horror', 'Thriller', 'Comedy', 'Family', 'Motivational',
    'Fairy Tales', 'Adventure', 'Sci-Fi', 'Mystery', 'Mythology', 'Historical',
    'Biographies', 'Fantasy', 'Self-Help', 'Poems', 'Travel Stories',
    'Educational', 'Superhero', 'Detective'
  ];
  
  if (isKidsMode) {
    return allCategories.filter(isKidsSafe);
  }
  
  return allCategories;
}
