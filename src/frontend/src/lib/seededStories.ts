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
    likes: 42n,
    rating: 4n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Love in Madurai',
        body: 'In the bustling streets of Madurai, where the scent of jasmine filled the air and temple bells rang through the evening, Meera ran a small flower shop near the Meenakshi Temple. Every morning, she would arrange fresh garlands with practiced hands, her fingers moving swiftly through roses, marigolds, and jasmine. Across the street, Arjun managed his family\'s traditional silk saree shop, a business passed down through generations. Their eyes met one day when Meera delivered flowers for a wedding order. Arjun was captivated by her grace and the way she spoke about flowers as if they were poetry. Days turned into weeks, and their casual conversations grew deeper. They would meet at the temple steps after closing their shops, sharing stories of their dreams and fears. Meera spoke of wanting to expand her business, while Arjun confessed his struggle between tradition and modernity. One evening, during the Chithirai festival, as the city lit up with celebrations, Arjun finally gathered the courage to express his feelings. Under the glow of oil lamps and surrounded by the fragrance of flowers, he told Meera that she had become the most beautiful part of his daily routine. Meera smiled, her eyes reflecting the lamplight, and admitted she felt the same. Their love story became the talk of the neighborhood, a modern romance rooted in tradition, proving that love could bloom even in the busiest of streets.',
        summary: 'A heartwarming romance between a flower shop owner and a silk saree merchant in the vibrant city of Madurai.',
      },
      tamil: {
        title: 'மதுரையில் காதல்',
        body: 'மதுரையின் பரபரப்பான தெருக்களில், மல்லிகை மணம் காற்றில் நிரம்பி, கோவில் மணிகள் மாலையில் ஒலித்த இடத்தில், மீனாட்சி கோவிலுக்கு அருகில் மீரா ஒரு சிறிய பூக்கடை நடத்தி வந்தாள். ஒவ்வொரு காலையிலும், அவள் புதிய மாலைகளை திறமையான கைகளால் அமைப்பாள், அவளது விரல்கள் ரோஜாக்கள், சாமந்திகள் மற்றும் மல்லிகைகள் வழியாக வேகமாக நகரும். தெருவின் குறுக்கே, அர்ஜுன் தனது குடும்பத்தின் பாரம்பரிய பட்டுப்புடவை கடையை நிர்வகித்து வந்தார், இது தலைமுறைகளாக கடத்தப்பட்ட வணிகம். ஒரு நாள் மீரா திருமண ஆர்டருக்கு பூக்களை வழங்கியபோது அவர்களின் கண்கள் சந்தித்தன.',
        summary: 'மதுரையின் துடிப்பான நகரத்தில் ஒரு பூக்கடை உரிமையாளருக்கும் பட்டுப்புடவை வணிகருக்கும் இடையிலான இதயத்தைத் தொடும் காதல்.',
      },
      hindi: {
        title: 'मदुरै में प्यार',
        body: 'मदुरै की हलचल भरी गलियों में, जहां हवा में चमेली की खुशबू भरी थी और शाम को मंदिर की घंटियां बजती थीं, मीरा मीनाक्षी मंदिर के पास एक छोटी सी फूलों की दुकान चलाती थी। हर सुबह, वह अभ्यस्त हाथों से ताजे फूलों की मालाएं सजाती, उसकी उंगलियां गुलाब, गेंदे और चमेली के बीच तेजी से चलतीं। सड़क के उस पार, अर्जुन अपने परिवार की पारंपरिक रेशमी साड़ी की दुकान संभालता था।',
        summary: 'मदुरै के जीवंत शहर में एक फूलों की दुकान की मालकिन और एक रेशमी साड़ी व्यापारी के बीच दिल को छू लेने वाला रोमांस।',
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
    likes: 38n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Puzzle Pieces',
        body: 'Asha and Raman felt like missing pieces of a jigsaw puzzle. Their lives kept crossing paths, from childhood to adulthood. They grew up in the same neighborhood, attended the same school, yet never really connected. Years passed, and life took them in different directions. Asha became a teacher, nurturing young minds with patience and care. Raman pursued engineering, building bridges and roads that connected cities. One rainy night, fate brought them together at a coffee shop. The power had gone out, and candles lit the cozy space. They started talking, sharing memories of their childhood, laughing at coincidences. As the rain poured outside, they realized how perfectly they complemented each other. Asha\'s creativity balanced Raman\'s logic. His stability grounded her dreams. They finally understood that all those years of crossing paths were leading to this moment. Like puzzle pieces, they fit together perfectly in love\'s intricate design. Their story became a testament to the idea that sometimes, the right person has been there all along, waiting for the perfect moment to connect.',
        summary: 'Two childhood acquaintances discover they are perfect for each other after years of crossing paths.',
      },
      tamil: {
        title: 'புதிர் துண்டுகள்',
        body: 'ஆஷா மற்றும் ராமன் ஒரு ஜிக்சா புதிரின் காணாமல் போன துண்டுகள் போல உணர்ந்தனர். அவர்களின் வாழ்க்கை குழந்தைப் பருவம் முதல் வயது வரை பாதைகளை கடந்து கொண்டே இருந்தது. அவர்கள் ஒரே அக்கம் பக்கத்தில் வளர்ந்தனர், ஒரே பள்ளியில் படித்தனர், ஆனால் உண்மையில் ஒருபோதும் இணைக்கப்படவில்லை.',
        summary: 'பல ஆண்டுகளாக பாதைகளை கடந்த பிறகு இரண்டு குழந்தைப் பருவ அறிமுகமானவர்கள் ஒருவருக்கொருவர் சரியானவர்கள் என்பதைக் கண்டுபிடிக்கிறார்கள்.',
      },
      hindi: {
        title: 'पहेली के टुकड़े',
        body: 'आशा और रमन को लगा कि वे एक जिगसॉ पहेली के लापता टुकड़े हैं। उनके जीवन बचपन से लेकर वयस्कता तक एक-दूसरे से टकराते रहे। वे एक ही पड़ोस में पले-बढ़े, एक ही स्कूल में पढ़े, फिर भी कभी वास्तव में जुड़े नहीं।',
        summary: 'दो बचपन के परिचित वर्षों तक रास्ते पार करने के बाद पाते हैं कि वे एक-दूसरे के लिए एकदम सही हैं।',
      },
    },
    timestamp: 1641081600000000000n,
  },
  {
    id: 3n,
    isKidFriendly: false,
    category: 'Horror',
    author: 'Admin',
    readTimeMinutes: 6n,
    likes: 56n,
    rating: 4n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Midnight Whispers',
        body: 'Sneha struggled to sleep as eerie whispers echoed in her room. Shadows on the walls grew long and menacing, making her heart pound. She had just moved into this old colonial house in the hills, attracted by its vintage charm and affordable rent. But from the first night, something felt wrong. The whispers started softly, like wind through cracks, but grew clearer each night. They spoke in a language she couldn\'t understand, yet somehow felt ancient and malevolent. As the clock struck midnight, the whispers turned into sinister laughter, freezing Sneha in terror. She pulled the blanket over her head, her breath coming in short gasps. The laughter grew louder, seeming to come from all directions at once. Suddenly, everything went silent. In that silence, more terrifying than any sound, Sneha felt a cold presence at the foot of her bed. She dared not look. The next morning, she found scratch marks on her bedroom door from the inside, as if something had been trying to get out. The locals later told her about the house\'s dark history, but by then, it was too late to leave.',
        summary: 'A woman experiences terrifying supernatural encounters in her new colonial house.',
      },
      tamil: {
        title: 'நள்ளிரவு கிசுகிசுக்கள்',
        body: 'சினேகா தூங்க முடியாமல் தவித்தாள், அவளது அறையில் பயங்கரமான கிசுகிசுக்கள் எதிரொலித்தன. சுவர்களில் நிழல்கள் நீண்டு மிரட்டுவதாக வளர்ந்தன, அவளது இதயத்தை துடிக்க வைத்தன. அவள் மலைகளில் உள்ள இந்த பழைய காலனித்துவ வீட்டிற்கு இப்போதுதான் குடிபெயர்ந்தாள், அதன் பழமையான வசீகரம் மற்றும் மலிவு வாடகையால் ஈர்க்கப்பட்டாள்.',
        summary: 'ஒரு பெண் தனது புதிய காலனித்துவ வீட்டில் பயங்கரமான இயற்கைக்கு அப்பாற்பட்ட சந்திப்புகளை அனுபவிக்கிறாள்.',
      },
      hindi: {
        title: 'आधी रात की कानाफूसी',
        body: 'स्नेहा को सोने में परेशानी हो रही थी क्योंकि उसके कमरे में भयानक फुसफुसाहट गूंज रही थी। दीवारों पर छायाएं लंबी और खतरनाक हो गईं, जिससे उसका दिल तेजी से धड़कने लगा। वह अभी-अभी पहाड़ियों में इस पुराने औपनिवेशिक घर में आई थी।',
        summary: 'एक महिला अपने नए औपनिवेशिक घर में भयानक अलौकिक मुठभेड़ों का अनुभव करती है।',
      },
    },
    timestamp: 1641168000000000000n,
  },
  {
    id: 4n,
    isKidFriendly: false,
    category: 'Horror',
    author: 'Admin',
    readTimeMinutes: 9n,
    likes: 67n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Haunted Forest',
        body: 'Lost deep in the woods, Rahul and his friends stumbled upon a haunted cabin. Strange noises echoed through the trees, and mysterious lights flickered in the darkness. They had been hiking for hours, trying to find their way back to the main trail, when the sun suddenly set, plunging them into an eerie twilight. The cabin appeared like a mirage, its windows dark and unwelcoming. Desperate for shelter, they pushed open the creaking door. Inside, dust covered everything, and the air smelled of decay. As they explored, they found old photographs on the walls, showing a family that had lived there decades ago. But something was wrong with the photos – the faces seemed to follow them. That night, they heard footsteps on the floor above, though the cabin was supposedly abandoned. One by one, strange things began to happen. Objects moved on their own, doors slammed shut, and whispers filled the air. By morning, only two of them remained, their eyes wide with terror. The survivors never uttered a word about the horrors they witnessed that night, but their haunted expressions told the story.',
        summary: 'A group of friends encounter supernatural terror in an abandoned cabin deep in the forest.',
      },
      tamil: {
        title: 'ஆவி காடு',
        body: 'காட்டில் ஆழமாக தொலைந்து போய், ராகுல் மற்றும் அவரது நண்பர்கள் ஒரு பேய் பிடித்த குடிசையை தடுமாறினர். மரங்கள் வழியாக விசித்திரமான சத்தங்கள் எதிரொலித்தன, மற்றும் மர்மமான விளக்குகள் இருளில் மினுமினுத்தன.',
        summary: 'காட்டின் ஆழத்தில் கைவிடப்பட்ட குடிசையில் ஒரு நண்பர்கள் குழு இயற்கைக்கு அப்பாற்பட்ட பயங்கரத்தை சந்திக்கிறது.',
      },
      hindi: {
        title: 'भूतिया जंगल',
        body: 'जंगल में गहराई में खोए हुए, राहुल और उसके दोस्त एक भूतिया केबिन पर ठोकर खाई। पेड़ों के बीच अजीब आवाजें गूंजीं, और अंधेरे में रहस्यमय रोशनी टिमटिमाई।',
        summary: 'दोस्तों का एक समूह जंगल की गहराई में एक परित्यक्त केबिन में अलौकिक आतंक का सामना करता है।',
      },
    },
    timestamp: 1641254400000000000n,
  },
  {
    id: 5n,
    isKidFriendly: false,
    category: 'Thriller',
    author: 'Admin',
    readTimeMinutes: 7n,
    likes: 45n,
    rating: 4n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Disappearing Act',
        body: 'Arjun couldn\'t believe his eyes when his friend vanished before him. Frantically searching, he encountered strange symbols and cryptic messages. They had been investigating a series of mysterious disappearances in their city, following leads that took them to abandoned buildings and dark alleys. His friend, Vikram, had been the brave one, always pushing forward when Arjun wanted to turn back. That evening, they had discovered a hidden basement beneath an old theater. The walls were covered in strange symbols that seemed to pulse with an otherworldly energy. Vikram had stepped forward to examine them more closely, and in that instant, he simply ceased to exist. No flash of light, no sound – he was just gone. Arjun screamed his name, but only silence answered. The symbols on the wall began to glow brighter, and Arjun realized with horror that they were some kind of portal. He found a journal in the corner, filled with notes from previous investigators who had also lost people to the symbols. The last entry warned: "Don\'t try to bring them back. You\'ll only join them." But Arjun couldn\'t abandon his friend. Nothing was as it seemed in this twisted tale of deception and intrigue.',
        summary: 'A man investigates his friend\'s mysterious disappearance and uncovers a sinister conspiracy.',
      },
      tamil: {
        title: 'மாயச் செயல்',
        body: 'அர்ஜுன் தனது நண்பர் தனக்கு முன்னால் மறைந்தபோது தனது கண்களை நம்ப முடியவில்லை. வெறித்தனமாக தேடி, அவர் விசித்திரமான சின்னங்கள் மற்றும் மறைமுக செய்திகளை சந்தித்தார்.',
        summary: 'ஒரு மனிதன் தனது நண்பரின் மர்மமான காணாமல் போவதை விசாரித்து ஒரு பயங்கரமான சதியை வெளிப்படுத்துகிறான்.',
      },
      hindi: {
        title: 'गायब होने का कार्य',
        body: 'अर्जुन अपनी आंखों पर विश्वास नहीं कर सका जब उसका दोस्त उसके सामने गायब हो गया। पागलों की तरह खोजते हुए, उसे अजीब प्रतीक और गूढ़ संदेश मिले।',
        summary: 'एक आदमी अपने दोस्त के रहस्यमय गायब होने की जांच करता है और एक भयावह साजिश का पर्दाफाश करता है।',
      },
    },
    timestamp: 1641340800000000000n,
  },
  {
    id: 6n,
    isKidFriendly: false,
    category: 'Thriller',
    author: 'Admin',
    readTimeMinutes: 8n,
    likes: 52n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Cold Case Files',
        body: 'Detective Maya investigated an unsolved mystery that left readers on the edge of their seats. The case had been cold for fifteen years – a wealthy businessman found dead in his locked study, no signs of forced entry, no weapon, no suspects. Maya had just been promoted to the cold case unit and chose this as her first investigation. She pored over old files, interviewed witnesses whose memories had faded, and visited the crime scene, now converted into a museum. The businessman\'s family had preserved the study exactly as it was, hoping someday the truth would emerge. Maya noticed something the original investigators had missed – a pattern in the books on the shelf. They weren\'t arranged alphabetically or by genre, but seemed to follow a code. Working late into the night, she deciphered the message hidden in the book spines. It pointed to a secret compartment in the desk, containing letters that revealed a blackmail scheme. The businessman had been poisoned slowly over months by someone he trusted completely. Twists and turns at every corner made this thrilling adventure intense for all involved. The final revelation shocked everyone, including Maya herself.',
        summary: 'A detective reopens a fifteen-year-old cold case and uncovers shocking secrets.',
      },
      tamil: {
        title: 'குளிர் வழக்கு கோப்புகள்',
        body: 'துப்பறியும் மாயா ஒரு தீர்க்கப்படாத மர்மத்தை விசாரித்தார், இது வாசகர்களை அவர்களின் இருக்கைகளின் விளிம்பில் விட்டது. வழக்கு பதினைந்து ஆண்டுகளாக குளிர்ச்சியாக இருந்தது.',
        summary: 'ஒரு துப்பறியும் பதினைந்து வயது பழைய குளிர் வழக்கை மீண்டும் திறந்து அதிர்ச்சியூட்டும் ரகசியங்களை வெளிப்படுத்துகிறார்.',
      },
      hindi: {
        title: 'कोल्ड केस फाइलें',
        body: 'जासूस माया ने एक अनसुलझे रहस्य की जांच की जिसने पाठकों को अपनी सीटों के किनारे पर छोड़ दिया। मामला पंद्रह साल से ठंडा पड़ा था।',
        summary: 'एक जासूस पंद्रह साल पुराने कोल्ड केस को फिर से खोलती है और चौंकाने वाले रहस्यों का खुलासा करती है।',
      },
    },
    timestamp: 1641427200000000000n,
  },
  {
    id: 7n,
    isKidFriendly: true,
    category: 'Comedy',
    author: 'Admin',
    readTimeMinutes: 5n,
    likes: 89n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Pet Antics',
        body: 'During a rainstorm, two playful pets caused chaos indoors. Their hilarious attempts to avoid getting wet left everyone laughing. Max, the golden retriever, and Whiskers, the tabby cat, were mortal enemies on sunny days. But when the storm hit, they formed an unlikely alliance. The thunder scared them both, and they huddled together under the dining table, their usual rivalry forgotten. When the family tried to coax them out, Max made a dash for the kitchen, slipping on the wet floor and sliding into the cabinet with a loud crash. Whiskers, startled by the noise, leaped onto the curtains, climbing them like a ladder. The curtain rod couldn\'t handle the weight and came crashing down, wrapping Whiskers in fabric. Max, thinking it was a game, grabbed the other end of the curtain and started a tug-of-war. The family watched in amazement as their pets turned the living room into a disaster zone. Furniture was overturned, cushions were everywhere, and somehow, a potted plant ended up on the ceiling fan. By the time the storm passed, the house looked like a tornado had hit it. But seeing Max and Whiskers curled up together, exhausted and finally at peace, made it all worthwhile.',
        summary: 'Two pets create hilarious chaos while trying to avoid a rainstorm.',
      },
      tamil: {
        title: 'செல்லப்பிராணிகளின் குறும்புகள்',
        body: 'மழைப்புயலின் போது, இரண்டு விளையாட்டுத்தனமான செல்லப்பிராணிகள் வீட்டிற்குள் குழப்பத்தை ஏற்படுத்தின. ஈரமாவதைத் தவிர்க்க அவர்களின் நகைச்சுவையான முயற்சிகள் அனைவரையும் சிரிக்க வைத்தன.',
        summary: 'இரண்டு செல்லப்பிராணிகள் மழைப்புயலைத் தவிர்க்க முயற்சிக்கும்போது நகைச்சுவையான குழப்பத்தை உருவாக்குகின்றன.',
      },
      hindi: {
        title: 'पालतू जानवरों की शरारतें',
        body: 'बारिश के तूफान के दौरान, दो चंचल पालतू जानवरों ने घर के अंदर अराजकता पैदा कर दी। गीले होने से बचने के उनके मजेदार प्रयासों ने सभी को हंसाया।',
        summary: 'दो पालतू जानवर बारिश के तूफान से बचने की कोशिश करते हुए मजेदार अराजकता पैदा करते हैं।',
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
    likes: 76n,
    rating: 4n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Cooking Disaster',
        body: 'Raj decided to surprise his wife with a homemade dinner for their anniversary. He had never cooked before, but how hard could it be? Armed with a recipe from the internet and overconfidence, he entered the kitchen. The recipe called for "a pinch of salt," but Raj figured more was better. He added a handful. The instructions said to "sauté the onions until golden," but Raj got distracted by a phone call and they turned black. Smoke filled the kitchen, setting off the fire alarm. His wife rushed in to find Raj frantically waving a towel at the detector while the stove was still on fire. She quickly turned off the gas and opened all the windows. Raj looked at the charred remains of what was supposed to be a romantic pasta dish and felt defeated. But his wife burst out laughing at his flour-covered face and the kitchen that looked like a war zone. She hugged him and said, "Let\'s order pizza and never speak of this again." They spent the evening laughing about the disaster, and Raj learned that some things are better left to professionals. The burnt pot became a running joke in their household.',
        summary: 'A man\'s attempt to cook a romantic dinner goes hilariously wrong.',
      },
      tamil: {
        title: 'சமையல் பேரழிவு',
        body: 'ராஜ் தனது மனைவிக்கு அவர்களின் ஆண்டு விழாவிற்கு வீட்டில் தயாரிக்கப்பட்ட இரவு உணவுடன் ஆச்சரியப்படுத்த முடிவு செய்தார். அவர் இதுவரை சமைத்ததில்லை, ஆனால் அது எவ்வளவு கடினமாக இருக்க முடியும்?',
        summary: 'ஒரு மனிதனின் காதல் இரவு உணவை சமைக்கும் முயற்சி நகைச்சுவையாக தவறாகிறது.',
      },
      hindi: {
        title: 'खाना पकाने की आपदा',
        body: 'राज ने अपनी पत्नी को उनकी सालगिरह के लिए घर का बना डिनर देकर आश्चर्यचकित करने का फैसला किया। उसने पहले कभी खाना नहीं बनाया था, लेकिन यह कितना मुश्किल हो सकता है?',
        summary: 'एक आदमी का रोमांटिक डिनर पकाने का प्रयास मजेदार तरीके से गलत हो जाता है।',
      },
    },
    timestamp: 1641600000000000000n,
  },
  {
    id: 9n,
    isKidFriendly: true,
    category: 'Kids Fairy Tales',
    author: 'Admin',
    readTimeMinutes: 5n,
    likes: 124n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Kind Mouse',
        body: 'This delightful story follows the adventures of a kind mouse who helps his animal friends and learns important lessons about friendship. Mickey the mouse lived in a cozy hole beneath an old oak tree. Unlike other mice who only cared about finding cheese, Mickey loved helping others. One day, he found a baby bird that had fallen from its nest. Mickey carefully carried it back up the tree, even though he was afraid of heights. The mother bird was so grateful that she promised to help Mickey whenever he needed it. Another time, Mickey shared his food with a hungry squirrel during a harsh winter. The squirrel never forgot this kindness. When Mickey got trapped in a hunter\'s net, all the animals he had helped came to his rescue. The bird pecked at the ropes, the squirrel gnawed through the knots, and together they freed their friend. Mickey learned that kindness always comes back to you, often when you need it most. From that day on, all the forest animals looked out for each other, inspired by Mickey\'s generous heart. The forest became a happier place where everyone helped everyone.',
        summary: 'A kind-hearted mouse learns that helping others brings friendship and happiness.',
      },
      tamil: {
        title: 'நல்ல எலி',
        body: 'இந்த மகிழ்ச்சியான கதை தனது விலங்கு நண்பர்களுக்கு உதவும் ஒரு நல்ல எலியின் சாகசங்களைப் பின்பற்றுகிறது மற்றும் நட்பு பற்றிய முக்கியமான பாடங்களைக் கற்றுக்கொள்கிறது.',
        summary: 'ஒரு நல்ல இதயம் கொண்ட எலி மற்றவர்களுக்கு உதவுவது நட்பையும் மகிழ்ச்சியையும் கொண்டு வருகிறது என்பதை கற்றுக்கொள்கிறது.',
      },
      hindi: {
        title: 'दयालु चूहा',
        body: 'यह रमणीय कहानी एक दयालु चूहे के रोमांच का अनुसरण करती है जो अपने पशु मित्रों की मदद करता है और दोस्ती के बारे में महत्वपूर्ण सबक सीखता है।',
        summary: 'एक दयालु दिल वाला चूहा सीखता है कि दूसरों की मदद करना दोस्ती और खुशी लाता है।',
      },
    },
    timestamp: 1641686400000000000n,
  },
  {
    id: 10n,
    isKidFriendly: true,
    category: 'Kids Fairy Tales',
    author: 'Admin',
    readTimeMinutes: 6n,
    likes: 98n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Brave Bunny',
        body: 'Despite being small, the brave bunny saved an entire field of vegetables and earned the animals\' respect. Benny was the smallest bunny in the warren, and the other rabbits often teased him for his size. But Benny had a brave heart and a clever mind. One day, a fox discovered their vegetable garden and planned to eat all the crops. The bigger rabbits were too scared to confront the fox. But Benny had an idea. He knew the fox was afraid of dogs, so he practiced barking until he sounded just like a fierce guard dog. When the fox returned, Benny hid in the bushes and barked loudly. The fox, thinking a dog was nearby, ran away in fear. The other rabbits were amazed at Benny\'s bravery and cleverness. From that day on, no one teased Benny about his size. Instead, they asked him to be their leader. Benny taught everyone that courage isn\'t about being big or strong – it\'s about being smart and standing up for what\'s right. The warren prospered under Benny\'s leadership, and he became a legend among rabbits.',
        summary: 'A small but brave bunny uses cleverness to protect his community from danger.',
      },
      tamil: {
        title: 'துணிச்சலான முயல்',
        body: 'சிறியதாக இருந்தபோதிலும், துணிச்சலான முயல் காய்கறிகளின் முழு வயலையும் காப்பாற்றி விலங்குகளின் மரியாதையைப் பெற்றது.',
        summary: 'ஒரு சிறிய ஆனால் துணிச்சலான முயல் தனது சமூகத்தை ஆபத்திலிருந்து பாதுகாக்க புத்திசாலித்தனத்தைப் பயன்படுத்துகிறது.',
      },
      hindi: {
        title: 'बहादुर खरगोश',
        body: 'छोटा होने के बावजूद, बहादुर खरगोश ने सब्जियों के पूरे खेत को बचाया और जानवरों का सम्मान अर्जित किया।',
        summary: 'एक छोटा लेकिन बहादुर खरगोश अपने समुदाय को खतरे से बचाने के लिए चतुराई का उपयोग करता है।',
      },
    },
    timestamp: 1641772800000000000n,
  },
  {
    id: 11n,
    isKidFriendly: true,
    category: 'Motivational',
    author: 'Admin',
    readTimeMinutes: 5n,
    likes: 112n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Believe in Yourself',
        body: 'This uplifting tale encourages believing in yourself, helping readers overcome self-doubt and fears. Priya had always dreamed of becoming a dancer, but everyone told her she started too late. At fifteen, most professional dancers had been training since they were five. Her parents wanted her to focus on academics, her friends said it was impossible, and even some dance teachers discouraged her. But Priya refused to give up on her dream. She practiced every single day, sometimes for hours after finishing her homework. She watched videos, learned from books, and attended every workshop she could afford. There were days when she wanted to quit, when her muscles ached and her feet bled. But she remembered why she started – because dance made her feel alive. Three years later, Priya auditioned for a prestigious dance academy. The judges were skeptical when they saw her age, but when she performed, they were speechless. Her passion and dedication shone through every movement. She got accepted, proving that it\'s never too late to chase your dreams. Priya\'s story inspired many others to believe in themselves and never give up.',
        summary: 'A teenager proves that with dedication and self-belief, it\'s never too late to pursue your dreams.',
      },
      tamil: {
        title: 'உங்களை நம்புங்கள்',
        body: 'இந்த உற்சாகமூட்டும் கதை உங்களை நம்புவதை ஊக்குவிக்கிறது, வாசகர்கள் சுய சந்தேகம் மற்றும் பயங்களை கடக்க உதவுகிறது.',
        summary: 'ஒரு இளைஞர் அர்ப்பணிப்பு மற்றும் சுய நம்பிக்கையுடன், உங்கள் கனவுகளைத் தொடர தாமதமாகவில்லை என்பதை நிரூபிக்கிறார்.',
      },
      hindi: {
        title: 'खुद पर विश्वास करें',
        body: 'यह उत्साहवर्धक कहानी खुद पर विश्वास करने को प्रोत्साहित करती है, पाठकों को आत्म-संदेह और भय को दूर करने में मदद करती है।',
        summary: 'एक किशोर साबित करता है कि समर्पण और आत्म-विश्वास के साथ, अपने सपनों का पीछा करने में कभी देर नहीं होती।',
      },
    },
    timestamp: 1641859200000000000n,
  },
  {
    id: 12n,
    isKidFriendly: false,
    category: 'Motivational',
    author: 'Admin',
    readTimeMinutes: 8n,
    likes: 87n,
    rating: 4n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Road Less Travelled',
        body: 'Sanjay\'s inspirational journey reminds us to take the road less traveled, finding courage in new beginnings. He had a secure job at a multinational company, a good salary, and the respect of his peers. But something was missing. Every morning, he woke up with a sense of dread, knowing he would spend another day doing work that didn\'t fulfill him. His real passion was photography, but everyone said it was just a hobby, not a career. One day, Sanjay made a decision that shocked everyone – he quit his job. His family was horrified, his friends thought he was crazy, and his colleagues said he was throwing away his future. But Sanjay knew he had to try. He started small, taking photos at local events, building a portfolio, and slowly gaining clients. There were months when he barely made enough to pay rent. There were times when he questioned his decision. But gradually, his unique style caught attention. A magazine featured his work, then another, and soon he was getting calls from around the country. Five years later, Sanjay\'s photography was exhibited in galleries, and he had published two books. He had taken the road less traveled, and it made all the difference.',
        summary: 'A man leaves his secure job to pursue his passion, proving that taking risks can lead to fulfillment.',
      },
      tamil: {
        title: 'குறைவாக பயணிக்கப்பட்ட சாலை',
        body: 'சஞ்சயின் ஊக்கமளிக்கும் பயணம் குறைவாக பயணிக்கப்பட்ட சாலையை எடுக்க நமக்கு நினைவூட்டுகிறது, புதிய தொடக்கங்களில் தைரியத்தைக் கண்டறிகிறது.',
        summary: 'ஒரு மனிதன் தனது பாதுகாப்பான வேலையை விட்டு தனது ஆர்வத்தைத் தொடர்கிறான், ஆபத்துக்களை எடுப்பது நிறைவுக்கு வழிவகுக்கும் என்பதை நிரூபிக்கிறான்.',
      },
      hindi: {
        title: 'कम यात्रा की गई सड़क',
        body: 'संजय की प्रेरणादायक यात्रा हमें कम यात्रा की गई सड़क लेने की याद दिलाती है, नई शुरुआत में साहस खोजती है।',
        summary: 'एक आदमी अपने जुनून का पीछा करने के लिए अपनी सुरक्षित नौकरी छोड़ देता है, यह साबित करता है कि जोखिम लेना पूर्ति की ओर ले जा सकता है।',
      },
    },
    timestamp: 1641945600000000000n,
  },
  {
    id: 13n,
    isKidFriendly: false,
    category: 'Thriller',
    author: 'Admin',
    readTimeMinutes: 7n,
    likes: 63n,
    rating: 4n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Silent Witness',
        body: 'A security camera holds the key to solving a murder, but someone will do anything to destroy the evidence. Detective Sharma arrived at the crime scene – a luxury apartment where a famous actress had been found dead. The initial investigation suggested suicide, but something didn\'t add up. Sharma noticed a security camera in the corner, its red light still blinking. The building manager said the footage was automatically uploaded to a cloud server. But when they tried to access it, the files were corrupted. Someone had hacked the system. Sharma realized the killer was still watching, trying to cover their tracks. She set a trap, announcing publicly that they had recovered the footage and would reveal the killer the next day. That night, someone broke into the police station, confirming Sharma\'s suspicions. The intruder was caught, and under interrogation, confessed to the murder. The actress had discovered evidence of a major financial fraud, and the killer had silenced her. The security camera, though its footage was destroyed, had still helped solve the case by forcing the killer to reveal themselves. Justice was served, but Sharma knew this was just one case among many where technology played a crucial role.',
        summary: 'A detective uses a security camera as bait to catch a clever killer.',
      },
      tamil: {
        title: 'அமைதியான சாட்சி',
        body: 'ஒரு பாதுகாப்பு கேமரா ஒரு கொலையைத் தீர்ப்பதற்கான திறவுகோலை வைத்திருக்கிறது, ஆனால் யாரோ ஒருவர் ஆதாரத்தை அழிக்க எதையும் செய்வார்.',
        summary: 'ஒரு துப்பறியும் ஒரு புத்திசாலி கொலைகாரனைப் பிடிக்க ஒரு பாதுகாப்பு கேமராவை தூண்டிலாகப் பயன்படுத்துகிறார்.',
      },
      hindi: {
        title: 'मूक गवाह',
        body: 'एक सुरक्षा कैमरा एक हत्या को सुलझाने की कुंजी रखता है, लेकिन कोई सबूत को नष्ट करने के लिए कुछ भी करेगा।',
        summary: 'एक जासूस एक चतुर हत्यारे को पकड़ने के लिए एक सुरक्षा कैमरे को चारा के रूप में उपयोग करती है।',
      },
    },
    timestamp: 1642032000000000000n,
  },
  {
    id: 14n,
    isKidFriendly: true,
    category: 'Kids Fairy Tales',
    author: 'Admin',
    readTimeMinutes: 5n,
    likes: 105n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Magic Paintbrush',
        body: 'A young girl discovers a paintbrush that brings her drawings to life, teaching her about responsibility and creativity. Lily found the old paintbrush in her grandmother\'s attic, covered in dust and forgotten. When she cleaned it and tried to paint, something magical happened – whatever she drew became real! She painted a butterfly, and it flew off the page. She drew a cupcake, and it appeared on her desk, delicious and real. Excited, Lily started painting everything she wanted – toys, candy, even a puppy. But soon, her room was overflowing with stuff, and the puppy needed care she wasn\'t ready to provide. Her grandmother explained that magic comes with responsibility. Lily learned to think carefully before painting. She drew food for hungry birds, flowers for the neighborhood garden, and books for the library. She used her gift to help others, not just herself. The magic paintbrush taught Lily that true creativity isn\'t about having everything you want – it\'s about making the world a better place. She became known as the girl who could paint happiness, and her art brought joy to everyone around her.',
        summary: 'A magical paintbrush teaches a girl about using her gifts responsibly to help others.',
      },
      tamil: {
        title: 'மந்திர வண்ணத்தூரிகை',
        body: 'ஒரு இளம் பெண் தனது வரைபடங்களை உயிர்ப்பிக்கும் ஒரு வண்ணத்தூரிகையைக் கண்டுபிடிக்கிறாள், பொறுப்பு மற்றும் படைப்பாற்றல் பற்றி அவளுக்குக் கற்பிக்கிறது.',
        summary: 'ஒரு மந்திர வண்ணத்தூரிகை ஒரு பெண்ணுக்கு மற்றவர்களுக்கு உதவ தனது பரிசுகளை பொறுப்புடன் பயன்படுத்துவது பற்றி கற்பிக்கிறது.',
      },
      hindi: {
        title: 'जादुई पेंटब्रश',
        body: 'एक युवा लड़की एक पेंटब्रश की खोज करती है जो उसके चित्रों को जीवंत करता है, उसे जिम्मेदारी और रचनात्मकता के बारे में सिखाता है।',
        summary: 'एक जादुई पेंटब्रश एक लड़की को दूसरों की मदद करने के लिए अपने उपहारों का जिम्मेदारी से उपयोग करने के बारे में सिखाता है।',
      },
    },
    timestamp: 1642118400000000000n,
  },
  {
    id: 15n,
    isKidFriendly: false,
    category: 'Romance',
    author: 'Admin',
    readTimeMinutes: 7n,
    likes: 71n,
    rating: 4n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'Letters Across Time',
        body: 'An old letter found in a library book connects two people across decades in an unexpected romance. Ananya was a librarian who loved old books. One day, while cataloging donations, she found a letter tucked inside a 1960s poetry collection. It was a love letter, beautifully written but never sent. The writer, someone named Vikram, poured his heart out to a woman named Priya, confessing feelings he was too afraid to express in person. Moved by the letter, Ananya decided to find out what happened to them. She researched old records, contacted elderly residents, and pieced together their story. Vikram and Priya had been classmates who lost touch after graduation. Vikram had written the letter but never had the courage to give it to her. Ananya discovered that Vikram had passed away, but Priya was still alive, living in a retirement home. She visited Priya and gave her the letter. Reading it after fifty years, Priya cried, realizing that Vikram had loved her all along. She had loved him too but thought he never noticed her. Though they never got their chance, the letter brought Priya closure and peace. Ananya\'s own heart was touched by their story, reminding her to never leave words unsaid.',
        summary: 'A librarian discovers an old love letter and reunites it with its intended recipient decades later.',
      },
      tamil: {
        title: 'காலத்தின் குறுக்கே கடிதங்கள்',
        body: 'ஒரு நூலக புத்தகத்தில் காணப்பட்ட ஒரு பழைய கடிதம் பல தசாப்தங்களாக இரண்டு நபர்களை எதிர்பாராத காதலில் இணைக்கிறது.',
        summary: 'ஒரு நூலகர் ஒரு பழைய காதல் கடிதத்தைக் கண்டுபிடித்து பல தசாப்தங்களுக்குப் பிறகு அதன் நோக்கம் கொண்ட பெறுநருடன் மீண்டும் இணைக்கிறார்.',
      },
      hindi: {
        title: 'समय के पार पत्र',
        body: 'एक पुस्तकालय की किताब में मिला एक पुराना पत्र दशकों में दो लोगों को एक अप्रत्याशित रोमांस में जोड़ता है।',
        summary: 'एक पुस्तकालयाध्यक्ष एक पुराने प्रेम पत्र की खोज करती है और दशकों बाद इसे इसके इच्छित प्राप्तकर्ता के साथ फिर से मिलाती है।',
      },
    },
    timestamp: 1642204800000000000n,
  },
  {
    id: 16n,
    isKidFriendly: true,
    category: 'Comedy',
    author: 'Admin',
    readTimeMinutes: 6n,
    likes: 92n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Confused Robot',
        body: 'A household robot gets its wires crossed and creates hilarious chaos while trying to help. The Sharma family had just bought the latest home assistant robot, guaranteed to make life easier. They named it Robo and programmed it to help with chores. But something went wrong during setup. When Mrs. Sharma asked Robo to "make the bed," it literally tried to build a bed from scratch, using furniture from other rooms. When Mr. Sharma said "iron my shirt," Robo heated up an actual iron and tried to press it against his shirt while he was still wearing it! The kids asked Robo to "play music," and it started banging pots and pans together like drums. The family tried to fix it, but every command made things worse. "Clean the windows" resulted in Robo spraying water everywhere, including on the family. "Vacuum the floor" ended with Robo sucking up the cat\'s tail (the cat was fine, just very annoyed). Finally, they called tech support, who discovered that Robo had been programmed in literal mode instead of contextual mode. Once fixed, Robo became the perfect helper. But the family never forgot the chaotic week when their robot took everything literally, and they still laugh about it at dinner.',
        summary: 'A malfunctioning robot interprets commands literally, causing comedic disasters.',
      },
      tamil: {
        title: 'குழப்பமான ரோபோ',
        body: 'ஒரு வீட்டு ரோபோ அதன் கம்பிகள் குறுக்காக செல்கிறது மற்றும் உதவ முயற்சிக்கும்போது நகைச்சுவையான குழப்பத்தை உருவாக்குகிறது.',
        summary: 'ஒரு செயலிழந்த ரோபோ கட்டளைகளை நேரடியாக விளக்குகிறது, நகைச்சுவை பேரழிவுகளை ஏற்படுத்துகிறது.',
      },
      hindi: {
        title: 'भ्रमित रोबोट',
        body: 'एक घरेलू रोबोट के तार उलझ जाते हैं और मदद करने की कोशिश करते हुए मजेदार अराजकता पैदा करता है।',
        summary: 'एक खराब रोबोट आदेशों की शाब्दिक व्याख्या करता है, हास्य आपदाओं का कारण बनता है।',
      },
    },
    timestamp: 1642291200000000000n,
  },
  {
    id: 17n,
    isKidFriendly: false,
    category: 'Horror',
    author: 'Admin',
    readTimeMinutes: 8n,
    likes: 79n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Mirror\'s Secret',
        body: 'An antique mirror shows reflections of the past, revealing a dark secret that refuses to stay buried. Kavya bought the ornate mirror at an estate sale, drawn to its intricate frame and surprisingly low price. She hung it in her bedroom, admiring how it made the room look bigger. But that first night, she noticed something strange – her reflection moved a second too slow, as if lagging behind her movements. She dismissed it as tiredness. The next night, she saw someone else in the mirror, standing behind her. When she turned around, no one was there. The figure in the mirror looked terrified, mouthing words Kavya couldn\'t hear. Over the following nights, the visions became clearer. The mirror was showing her scenes from the past – a woman being chased through the house, hiding in the very room where Kavya now slept. Kavya researched the house\'s history and discovered that a woman had disappeared there thirty years ago, never found. The mirror had belonged to her. One night, the reflection showed Kavya where the woman\'s body was hidden – behind a false wall in the basement. Kavya called the police, and they found the remains. After the woman was properly buried, the mirror\'s visions stopped. Some secrets, it seemed, demanded to be revealed.',
        summary: 'An antique mirror reveals visions of a past murder, leading to the discovery of a long-hidden body.',
      },
      tamil: {
        title: 'கண்ணாடியின் ரகசியம்',
        body: 'ஒரு பழங்கால கண்ணாடி கடந்த காலத்தின் பிரதிபலிப்புகளைக் காட்டுகிறது, புதைக்கப்பட்டு இருக்க மறுக்கும் ஒரு இருண்ட ரகசியத்தை வெளிப்படுத்துகிறது.',
        summary: 'ஒரு பழங்கால கண்ணாடி கடந்த கால கொலையின் தரிசனங்களை வெளிப்படுத்துகிறது, நீண்ட காலமாக மறைக்கப்பட்ட உடலைக் கண்டுபிடிக்க வழிவகுக்கிறது.',
      },
      hindi: {
        title: 'दर्पण का रहस्य',
        body: 'एक प्राचीन दर्पण अतीत के प्रतिबिंब दिखाता है, एक अंधेरे रहस्य को प्रकट करता है जो दफन रहने से इनकार करता है।',
        summary: 'एक प्राचीन दर्पण एक पिछली हत्या के दर्शन प्रकट करता है, जो लंबे समय से छिपे शरीर की खोज की ओर ले जाता है।',
      },
    },
    timestamp: 1642377600000000000n,
  },
  {
    id: 18n,
    isKidFriendly: true,
    category: 'Motivational',
    author: 'Admin',
    readTimeMinutes: 6n,
    likes: 118n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Comeback Champion',
        body: 'After a career-ending injury, an athlete finds a new purpose and inspires others to never give up. Rohan was a rising cricket star, destined for the national team. Then, during a crucial match, he injured his knee so badly that doctors said he would never play professionally again. His world collapsed. Cricket was all he knew, all he had worked for since childhood. For months, Rohan fell into depression, watching his teammates continue without him. But one day, he visited a school for underprivileged children and saw kids playing cricket with makeshift equipment. Their joy reminded him why he fell in love with the sport in the first place. Rohan decided that if he couldn\'t play, he would coach. He started a free cricket academy for children who couldn\'t afford professional training. He poured all his knowledge and passion into teaching them. Years later, three of his students made it to the national team. At their debut match, they dedicated their success to Rohan, calling him their inspiration. Rohan realized that his injury hadn\'t ended his cricket career – it had transformed it into something even more meaningful. He had become a champion in a different way, creating champions instead of being one.',
        summary: 'An injured athlete finds new purpose by coaching underprivileged children, creating future champions.',
      },
      tamil: {
        title: 'மீண்டும் வரும் சாம்பியன்',
        body: 'தொழில் முடிவடையும் காயத்திற்குப் பிறகு, ஒரு விளையாட்டு வீரர் ஒரு புதிய நோக்கத்தைக் கண்டுபிடித்து மற்றவர்களை ஒருபோதும் கைவிடாமல் ஊக்குவிக்கிறார்.',
        summary: 'காயமடைந்த ஒரு விளையாட்டு வீரர் பின்தங்கிய குழந்தைகளுக்கு பயிற்சி அளிப்பதன் மூலம் புதிய நோக்கத்தைக் கண்டுபிடிக்கிறார், எதிர்கால சாம்பியன்களை உருவாக்குகிறார்.',
      },
      hindi: {
        title: 'वापसी चैंपियन',
        body: 'करियर समाप्त करने वाली चोट के बाद, एक एथलीट एक नया उद्देश्य पाता है और दूसरों को कभी हार न मानने के लिए प्रेरित करता है।',
        summary: 'एक घायल एथलीट वंचित बच्चों को कोचिंग देकर नया उद्देश्य पाता है, भविष्य के चैंपियन बनाता है।',
      },
    },
    timestamp: 1642464000000000000n,
  },
  {
    id: 19n,
    isKidFriendly: true,
    category: 'Kids Fairy Tales',
    author: 'Admin',
    readTimeMinutes: 5n,
    likes: 134n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Singing Tree',
        body: 'A magical tree that sings beautiful melodies teaches a village about the power of music and unity. In a small village, there stood an ancient tree that no one paid much attention to. Until one day, a little girl named Mira heard it singing. The tree\'s voice was like nothing she had ever heard – beautiful, haunting, and full of emotion. She told the villagers, but they didn\'t believe her. Trees don\'t sing, they said. But Mira knew what she heard. She visited the tree every day, listening to its songs. Slowly, other children started hearing it too. The tree sang different songs for different people – happy tunes for those who were sad, calming melodies for those who were angry, and hopeful songs for those who had lost their way. Word spread, and soon people from neighboring villages came to hear the singing tree. They would gather around it, and as they listened together, old feuds were forgotten, and new friendships formed. The tree\'s music had the power to bring people together. The village became known as the place where music healed hearts. And Mira, the first to hear the tree\'s song, became the village\'s first music teacher, passing on the gift the tree had given them.',
        summary: 'A magical singing tree brings a village together through the power of music.',
      },
      tamil: {
        title: 'பாடும் மரம்',
        body: 'அழகான மெல்லிசைகளைப் பாடும் ஒரு மந்திர மரம் ஒரு கிராமத்திற்கு இசை மற்றும் ஒற்றுமையின் சக்தியைப் பற்றி கற்பிக்கிறது.',
        summary: 'ஒரு மந்திர பாடும் மரம் இசையின் சக்தி மூலம் ஒரு கிராமத்தை ஒன்றிணைக்கிறது.',
      },
      hindi: {
        title: 'गाने वाला पेड़',
        body: 'एक जादुई पेड़ जो सुंदर धुनें गाता है, एक गांव को संगीत और एकता की शक्ति के बारे में सिखाता है।',
        summary: 'एक जादुई गाने वाला पेड़ संगीत की शक्ति के माध्यम से एक गांव को एक साथ लाता है।',
      },
    },
    timestamp: 1642550400000000000n,
  },
  {
    id: 20n,
    isKidFriendly: false,
    category: 'Thriller',
    author: 'Admin',
    readTimeMinutes: 9n,
    likes: 84n,
    rating: 5n,
    isPremium: false,
    coverImage: undefined,
    languages: {
      english: {
        title: 'The Last Train',
        body: 'A woman boards the last train of the night and realizes she\'s trapped in a deadly game of survival. Nisha missed her usual train and had to take the last one at midnight. The platform was empty, and only a handful of passengers boarded. As the train pulled away from the station, she noticed something odd – the other passengers were all staring at her. She tried to ignore them, focusing on her phone, but it had no signal. The train didn\'t stop at the next station, or the one after that. Panic set in. She approached the conductor, but his cabin was empty. The other passengers started moving toward her, their expressions blank and menacing. Nisha ran through the carriages, looking for an escape. She found a note in one of the compartments: "This train doesn\'t stop until someone gets off." She realized with horror that the passengers were ghosts, trapped on this train, and they wanted her to take their place. Using her wits, Nisha found the emergency brake and pulled it. The train screeched to a halt between stations. She forced open the doors and jumped out, rolling onto the tracks. As she looked back, the train vanished into thin air. She walked to the nearest station, shaken but alive, vowing never to take the last train again.',
        summary: 'A woman must escape a ghost train where passengers are trapped in an endless journey.',
      },
      tamil: {
        title: 'கடைசி ரயில்',
        body: 'ஒரு பெண் இரவின் கடைசி ரயிலில் ஏறுகிறாள் மற்றும் அவள் உயிர்வாழ்வதற்கான ஒரு மரண விளையாட்டில் சிக்கியிருப்பதை உணர்கிறாள்.',
        summary: 'ஒரு பெண் ஒரு பேய் ரயிலிலிருந்து தப்பிக்க வேண்டும், அங்கு பயணிகள் முடிவில்லாத பயணத்தில் சிக்கியுள்ளனர்.',
      },
      hindi: {
        title: 'आखिरी ट्रेन',
        body: 'एक महिला रात की आखिरी ट्रेन में चढ़ती है और महसूस करती है कि वह जीवित रहने के एक घातक खेल में फंस गई है।',
        summary: 'एक महिला को एक भूत ट्रेन से बचना होगा जहां यात्री एक अंतहीन यात्रा में फंसे हुए हैं।',
      },
    },
    timestamp: 1642636800000000000n,
  },
];
