import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SplashScreen() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between bg-gradient-to-b from-black via-[#0a0a2e] to-[#1a1a4e] px-6 py-8 safe-area-inset">
      {/* Top spacer */}
      <div className="flex-1" />
      
      {/* Center content */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* App Icon */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 mb-6 animate-fade-in">
          {!imageError ? (
            <img
              src="/assets/generated/gtu-app-icon.dim_512x512.png"
              alt="Global Tales Universe"
              className="w-full h-full object-contain drop-shadow-2xl"
              onError={() => {
                console.warn('Failed to load splash screen icon');
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl">
              <span className="text-6xl font-bold text-white">GTU</span>
            </div>
          )}
        </div>
        
        {/* App Name */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center animate-fade-in-delay-1">
          Global Tales Universe
        </h1>
        
        {/* Taglines */}
        <div className="flex flex-col items-center gap-2 animate-fade-in-delay-2">
          <p className="text-base sm:text-lg text-purple-200 text-center font-medium">
            Read Stories in Your Language Daily
          </p>
          <p className="text-sm sm:text-base text-purple-300 text-center font-tamil">
            உங்கள் மொழியில் தினசரி கதைகள்
          </p>
        </div>
      </div>
      
      {/* Bottom section */}
      <div className="flex flex-col items-center gap-4 animate-fade-in-delay-3">
        {/* Loading spinner */}
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
          <span className="text-sm text-purple-300">Loading...</span>
        </div>
        
        {/* Made in text */}
        <p className="text-xs text-purple-400/70 text-center">
          Made in Tirunelveli, Tamil Nadu
        </p>
      </div>
    </div>
  );
}
