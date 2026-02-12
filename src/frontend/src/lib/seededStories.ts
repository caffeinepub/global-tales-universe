import { Story } from '../backend';
import { isKidsSafe } from './kidsMode';

// Helper to map category to local cover image path
function getCoverImagePathForCategory(category: string, isKidFriendly: boolean): string {
  if (isKidFriendly) {
    return '/assets/generated/cover-kids-default.dim_1200x1600.png';
  }
  
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('romance')) {
    return '/assets/generated/cover-romance.dim_1200x1600.png';
  } else if (categoryLower.includes('horror')) {
    return '/assets/generated/cover-horror.dim_1200x1600.png';
  } else if (categoryLower.includes('comedy')) {
    return '/assets/generated/cover-comedy.dim_1200x1600.png';
  } else if (categoryLower.includes('educational')) {
    return '/assets/generated/cover-educational.dim_1200x1600.png';
  } else if (categoryLower.includes('superhero')) {
    return '/assets/generated/cover-superhero.dim_1200x1600.png';
  } else if (categoryLower.includes('mythology')) {
    return '/assets/generated/cover-mythology.dim_1200x1600.png';
  } else if (categoryLower.includes('fairy') || categoryLower.includes('kids')) {
    return '/assets/generated/cover-kids-default.dim_1200x1600.png';
  }
  
  return '/assets/generated/cover-default.dim_1200x1600.png';
}

// Export for use in components that need to derive cover URLs
export function getCoverImageForCategory(category: string, isKidFriendly: boolean): string {
  return getCoverImagePathForCategory(category, isKidFriendly);
}

// Filter seeded stories by kids mode
export function getFilteredSeededStories(isKidsMode: boolean): Story[] {
  if (isKidsMode) {
    return SEEDED_STORIES.filter(story => story.isKidFriendly && isKidsSafe(story.category));
  }
  return SEEDED_STORIES;
}

// Seeded dummy stories that are always available as fallback
// Note: coverImage is undefined since these are local stories without ExternalBlob
export const SEEDED_STORIES: Story[] = [
  // Romance
  {
    id: 1n,
    isKidFriendly: false,
    category: 'Romance',
    author: 'Admin',
    readTimeMinutes: 7n,
    likes: 0n,
    rating: 4n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Evening Stroll',
        body: 'It was a magical summer evening when Aditi met Aryan in the park. They strolled under the twinkling fairy lights, sharing stories and laughter. The soft glow of lanterns danced on their faces as they talked about dreams and hopes. Aditi spoke of her passion for painting, how she loved capturing the colors of sunset on canvas. Aryan shared his love for music, describing how melodies could tell stories without words. As the night grew deeper, they found themselves sitting on a bench, watching the stars appear one by one. The connection between them was undeniable, a spark that neither could ignore. They exchanged numbers, promising to meet again. Walking home that night, both felt a warmth in their hearts, knowing that something special had begun. The park would forever hold a special place in their memories, the beginning of a beautiful love story.',
        summary: 'A romance story about Aditi and Aryan\'s magical evening in the park.',
      },
      tamil: {
        title: 'மாலை நடமாட்டம்',
        body: 'அது ஒரு அற்புதமான கோடை மாலை, அடிதி ஆர்யனை பூங்காவில் சந்தித்தபோது. அவர்கள் மின்னும் விளக்குகளின் கீழ் நடந்து, கதைகள் மற்றும் சிரிப்புகளை பகிர்ந்து கொண்டார்கள்.',
        summary: 'அடிதி மற்றும் ஆர்யன் பூங்காவில் அனுபவித்த ஒரு காதல் கதை.',
      },
      hindi: {
        title: 'शाम की सैर',
        body: 'गर्मियों की एक सुंदर शाम थी जब अदिति और आर्यन पार्क में मिले।',
        summary: 'अदिति और आर्यन के पार्क में जादुई शाम की रोमांटिक कहानी।',
      },
    },
    timestamp: 1640995200000000000n,
  },
  {
    id: 2n,
    isKidFriendly: false,
    category: 'Romance',
    author: 'Admin',
    readTimeMinutes: 8n,
    likes: 0n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Puzzle Pieces',
        body: 'Asha and Raman felt like missing pieces of a jigsaw puzzle. Their lives kept crossing paths, from childhood to adulthood. They grew up in the same neighborhood, attended the same school, yet never really connected. Years passed, and life took them in different directions. Asha became a teacher, nurturing young minds with patience and care. Raman pursued engineering, building bridges and roads that connected cities. One rainy night, fate brought them together at a coffee shop. The power had gone out, and candles lit the cozy space. They started talking, sharing memories of their childhood, laughing at coincidences. As the rain poured outside, they realized how perfectly they complemented each other. Asha\'s creativity balanced Raman\'s logic. His stability grounded her dreams. They finally understood that all those years of crossing paths were leading to this moment. Like puzzle pieces, they fit together perfectly in love\'s intricate design.',
        summary: 'A romance story about missing puzzle pieces finding each other.',
      },
      tamil: {
        title: 'புதிர் துண்டுகள்',
        body: 'ஆஷா மற்றும் ராமன் வாழ்க்கையில் பலமுறை சந்திக்கப்பட்டனர்.',
        summary: 'ஆஷா மற்றும் ராமன் உணர்ந்த காதல் கதை.',
      },
      hindi: {
        title: 'पहेली के टुकड़े',
        body: 'आशा और रमन जीवन में कई बार मिले।',
        summary: 'आशा और रमन के प्यार की कहानी।',
      },
    },
    timestamp: 1641081600000000000n,
  },
  // Horror
  {
    id: 3n,
    isKidFriendly: false,
    category: 'Horror',
    author: 'Admin',
    readTimeMinutes: 6n,
    likes: 0n,
    rating: 4n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Midnight Whispers',
        body: 'Sneha struggled to sleep as eerie whispers echoed in her room. Shadows on the walls grew long and menacing, making her heart pound. As the clock struck midnight, the whispers turned into sinister laughter, freezing Sneha in terror.',
        summary: 'A horror story about chilling midnight whispers.',
      },
      tamil: {
        title: 'நள்ளிரவு கிசுகிசுக்கள்',
        body: 'சினேகா மிகவும் பயந்துபோய்ட்டிருந்தாள்.',
        summary: 'நள்ளிரவு கிசுகிசுக்கள் பற்றிய ஒரு பயங்கரமான கதை.',
      },
      hindi: {
        title: 'आधी रात की कानाफूसी',
        body: 'श्रद्धा विचित்र आवाज़ें सुनती रहती थी।',
        summary: 'आधी रात की कानाफूसी और डर का किस्सा।',
      },
    },
    timestamp: 1641168000000000000n,
  },
  // Comedy - Kids Friendly
  {
    id: 7n,
    isKidFriendly: true,
    category: 'Comedy',
    author: 'Admin',
    readTimeMinutes: 5n,
    likes: 0n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Pet Antics',
        body: 'During a rainstorm, two playful pets caused chaos indoors. Their hilarious attempts to avoid getting wet left everyone laughing.',
        summary: 'A funny story about pet antics.',
      },
      tamil: {
        title: 'விலங்குகளின் உட்கார்வுகள்',
        body: 'மழையில் நண்பர்கள் வீட்டிற்குள் கூடிய விபரீதங்களை நீக்குகிறது.',
        summary: 'விலங்குகளின் சிறிய கதையாவும்.',
      },
      hindi: {
        title: 'पालतू जानवरों की शरारत',
        body: 'बारिश के मौसम में, दो पालतू जानवरों ने अपने मालिकों को हंसाया।',
        summary: 'पालतू जानवरों की शरारतों की मजेदार कहानी।',
      },
    },
    timestamp: 1641513600000000000n,
  },
  {
    id: 8n,
    isKidFriendly: true,
    category: 'Comedy',
    author: 'Admin',
    readTimeMinutes: 6n,
    likes: 0n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Frog Prince Misadventures',
        body: 'When his secret was discovered, the frog prince stole a special golden ball, embarking on a series of humorous misadventures.',
        summary: 'A hilarious adaptation of the frog prince.',
      },
      tamil: {
        title: 'தவளை இளவரசனின் தவறுகள்',
        body: 'இளவரசனின் ஒளிப்படம் மற்றும் வெளியிடப்பட்ட கழிவுகளைச் சொல்வதிலிருந்து.',
        summary: 'தவளை இளவரசனின் மிகச்சிறந்த கதையாவும்.',
      },
      hindi: {
        title: 'मेंढक राजकुमार की कहानी',
        body: 'अपने रहस्य को बनाए रखने के लिए मेंढक ने भौंका।',
        summary: 'मेंढक राजकुमार की मजेदार कहानी।',
      },
    },
    timestamp: 1641600000000000000n,
  },
  // Kids Fairy Tales
  {
    id: 9n,
    isKidFriendly: true,
    category: 'Fairy Tales',
    author: 'Admin',
    readTimeMinutes: 5n,
    likes: 0n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Kind Mouse',
        body: 'This delightful story follows the adventures of a kind mouse who helps his animal friends and learns important lessons about friendship.',
        summary: 'A kind mouse\'s adventures in the forest.',
      },
      tamil: {
        title: 'நல்ல எலி',
        body: 'ஒரு நல்ல எலியின் நட்பும் மற்றும் பழக்கங்களைப் பற்றியது.',
        summary: 'நல்ல எலி மற்றும் நட்பு கதையாவும்.',
      },
      hindi: {
        title: 'दयालु चूहे की कहानी',
        body: 'दयालु चूहे ने अजनबियों की मदद करके अपने पड़ोसियों का प्यार सम्मान पाया।',
        summary: 'दयालु चूहे की प्रेरणादायक कहानी।',
      },
    },
    timestamp: 1641686400000000000n,
  },
  {
    id: 10n,
    isKidFriendly: true,
    category: 'Fairy Tales',
    author: 'Admin',
    readTimeMinutes: 6n,
    likes: 0n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Brave Bunny',
        body: 'Despite being small, the brave bunny saved an entire field of vegetables and earned the animals\' respect.',
        summary: 'How the brave bunny became a hero.',
      },
      tamil: {
        title: 'துணிச்சலான முயல்',
        body: 'சிறிய முயல் தனது துணிச்சலால் வெற்றிக்கு சென்றது.',
        summary: 'துணிச்சலான முயல் ஹீரோ ஆன கதை.',
      },
      hindi: {
        title: 'बहादुर खरगोश',
        body: 'नन्हा खरगोश अपनी बहादुरी और होशियारी से गाँव में फेमस हो गया।',
        summary: 'बहादुर खरगोश की प्रेरणादायक कहानी।',
      },
    },
    timestamp: 1641772800000000000n,
  },
  // Motivational - Kids Friendly
  {
    id: 11n,
    isKidFriendly: true,
    category: 'Motivational',
    author: 'Admin',
    readTimeMinutes: 5n,
    likes: 0n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Believe in Yourself',
        body: 'This uplifting tale encourages believing in yourself, helping readers overcome self-doubt and fears.',
        summary: 'Believe in yourself and overcome challenges.',
      },
      tamil: {
        title: 'உங்களை நம்புங்கள்',
        body: 'உங்களை நம்பி கனவுகள் பூண செல்லுங்கள் என்பதில் ஊக்கம் தரும் கதை.',
        summary: 'நம்பிக்கையின் வாழ்க்கையில் வெற்றிக்கான ஒரு கதையாவும்.',
      },
      hindi: {
        title: 'खुद पर विश्वास रखें',
        body: 'यह कहानी इस बारे में प्रेरित करती है कि खुद पर विश्वास रखकर कोई भी कितनी बड़ी उपलब्धियाँ पा सकता है।',
        summary: 'खुद पर विश्वास रखें, सफलता आवश्य पाएँगे।',
      },
    },
    timestamp: 1641859200000000000n,
  },
  // Educational - Kids Friendly
  {
    id: 12n,
    isKidFriendly: true,
    category: 'Educational',
    author: 'Admin',
    readTimeMinutes: 7n,
    likes: 0n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Solar System Adventure',
        body: 'Join young astronaut Maya as she explores the planets in our solar system. From the scorching heat of Mercury to the icy rings of Saturn, each planet has its own unique story. Maya learns about gravity, orbits, and the wonders of space while making friends with alien creatures along the way.',
        summary: 'An educational journey through the solar system.',
      },
      tamil: {
        title: 'சூரிய குடும்ப சாகசம்',
        body: 'இளம் விண்வெளி வீரர் மாயாவுடன் சூரிய குடும்பத்தின் கோள்களை ஆராயுங்கள்.',
        summary: 'சூரிய குடும்பம் பற்றிய கல்வி பயணம்.',
      },
      hindi: {
        title: 'सौर मंडल का रोमांच',
        body: 'युवा अंतरिक्ष यात्री माया के साथ हमारे सौर मंडल के ग्रहों का अन्वेषण करें।',
        summary: 'सौर मंडल के माध्यम से एक शैक्षिक यात्रा।',
      },
    },
    timestamp: 1641945600000000000n,
  },
  // Superhero - Kids Friendly
  {
    id: 13n,
    isKidFriendly: true,
    category: 'Superhero',
    author: 'Admin',
    readTimeMinutes: 8n,
    likes: 0n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Captain Courage',
        body: 'When the city is in danger, Captain Courage springs into action! With the power of bravery and kindness, this young hero shows that true strength comes from helping others. Join Captain Courage as they save the day and inspire everyone to be their own hero.',
        summary: 'A superhero story about courage and kindness.',
      },
      tamil: {
        title: 'கேப்டன் தைரியம்',
        body: 'நகரம் ஆபத்தில் இருக்கும்போது, கேப்டன் தைரியம் செயலில் குதிக்கிறார்!',
        summary: 'தைரியம் மற்றும் கருணை பற்றிய சூப்பர் ஹீரோ கதை.',
      },
      hindi: {
        title: 'कैप्टन साहस',
        body: 'जब शहर खतरे में होता है, तो कैप्टन साहस कार्रवाई में आ जाता है!',
        summary: 'साहस और दयालुता के बारे में एक सुपरहीरो कहानी।',
      },
    },
    timestamp: 1642032000000000000n,
  },
];
