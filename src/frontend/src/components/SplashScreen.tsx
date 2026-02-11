import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [quote] = useState(() => {
    const quotes = [
      'Stories connect us across cultures',
      'Every story is a journey',
      'Read the world, one tale at a time',
      'Where words come alive',
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20">
      <div className="relative w-32 h-32 mb-8 animate-pulse">
        <img
          src="/assets/generated/gtu-logo.dim_512x512.png"
          alt="Global Tales Universe"
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Global Tales Universe</h1>
      <p className="text-muted-foreground text-center px-8 italic">{quote}</p>
    </div>
  );
}
