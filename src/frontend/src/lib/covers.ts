export function getCoverUrl(category: string, isKidFriendly: boolean): string {
  if (isKidFriendly) {
    const kidsCovers: Record<string, string> = {
      'Fairy Tales': '/assets/generated/cover-kids-default.dim_1200x1600.png',
      'Educational': '/assets/generated/cover-educational.dim_1200x1600.png',
      'Superhero': '/assets/generated/cover-superhero.dim_1200x1600.png',
    };
    return kidsCovers[category] || '/assets/generated/cover-kids-default.dim_1200x1600.png';
  }

  const categoryCovers: Record<string, string> = {
    'Romance': '/assets/generated/cover-romance.dim_1200x1600.png',
    'Horror': '/assets/generated/cover-horror.dim_1200x1600.png',
    'Comedy': '/assets/generated/cover-comedy.dim_1200x1600.png',
    'Mythology': '/assets/generated/cover-mythology.dim_1200x1600.png',
  };

  return categoryCovers[category] || '/assets/generated/cover-default.dim_1200x1600.png';
}
