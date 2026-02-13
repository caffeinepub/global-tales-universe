import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Order "mo:core/Order";
import List "mo:core/List";
import Int "mo:core/Int";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Set "mo:core/Set";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type Language = {
    #english;
    #tamil;
    #hindi;
  };

  type Content = {
    title : Text;
    body : Text;
    summary : Text;
  };

  type Story = {
    id : Nat;
    isKidFriendly : Bool;
    category : Text;
    author : Text;
    readTimeMinutes : Nat;
    likes : Nat;
    rating : Nat;
    isPremium : Bool;
    coverImage : ?Storage.ExternalBlob;
    languages : {
      english : Content;
      tamil : Content;
      hindi : Content;
    };
    timestamp : Int;
  };

  type AppUser = {
    languagePreference : Language;
    favoriteStoryIds : [Nat];
    lastReadStoryId : ?Nat;
    searchHistory : [Text];
    readingHistory : [Nat];
    dailyStreak : Nat;
    badgeAchievements : [Text];
    readingChallengeProgress : Nat;
    adsWatched : Nat;
    premiumSubscriptionActive : Bool;
  };

  public type UserProfile = {
    displayName : Text;
    username : Text;
    image : ?Storage.ExternalBlob;
  };

  type StoryDraft = {
    id : Nat;
    text : Text;
    image : ?Storage.ExternalBlob;
    createdAt : Int;
    isPrivate : Bool;
    authorRole : Text;
  };

  module Story {
    public func compareByNewest(story1 : Story, story2 : Story) : Order.Order {
      if (story1.timestamp > story2.timestamp) { #less } else if (story1.timestamp < story2.timestamp) {
        #greater;
      } else { #equal };
    };
  };

  let stories = Map.empty<Nat, Story>();
  let storyDrafts = Map.empty<Principal, List.List<StoryDraft>>();
  let users = Map.empty<Principal, AppUser>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var isInitialized = false;

  let dummyStories : [Story] = [
    // Romance
    {
      id = 1;
      isKidFriendly = false;
      category = "Romance";
      author = "Admin";
      readTimeMinutes = 7;
      likes = 0;
      rating = 0;
      isPremium = false;
      coverImage = null;
      languages = {
        english = {
          title = "The Evening Stroll";
          body = "It was a magical summer evening when Aditi met Aryan in the park. They strolled under the twinkling fairy lights, sharing stories and laughter. The soft glow of lanterns danced on their faces as they talked about dreams and hopes...";
          summary = "A romance story about Aditi and Aryan's magical evening.";
        };
        tamil = {
          title = "மாலை நடமாட்டம்";
          body = "அது ஒரு அற்புதமான மாலை, அடி, ஆர்யனை சந்தித்தபோது. அவர்கள் ஒளிக்கிழமைகளுக்குட்போய் நடந்து கொண்டார்கள், கதைகள் மற்றும் சிரிப்புகளை பகிர்ந்து கொண்டார்கள்...";
          summary = "அடி மற்றும் ஆர்யன் அனுபவித்த ஒரு காதல் கதை.";
        };
        hindi = {
          title = "शाम की सैर";
          body = "गर्मियों की एक सुंदर शाम थी जब अदिति और आर्यन पार्क में मिले। एक-दूसरे की बातें और मुस्कानें उनके बीच प्यार की पहली किरण थीं...";
          summary = "अदिति और आर्यन के प्यार की शुरुआत का रोमांटिक किस्सा.";
        };
      };
      timestamp = 1640995200;
    },
    {
      id = 2;
      isKidFriendly = false;
      category = "Romance";
      author = "Admin";
      readTimeMinutes = 7;
      likes = 0;
      rating = 0;
      isPremium = true;
      coverImage = null;
      languages = {
        english = {
          title = "Puzzle Pieces";
          body = "Asha and Raman felt like missing pieces of a jigsaw puzzle. Their lives kept crossing paths, from childhood to adulthood. One rainy night, they finally realized how meant to be they were, fitting together perfectly in love's intricate puzzle.";
          summary = "A romance story about missing puzzle pieces finding each other.";
        };
        tamil = {
          title = "பழுதுபோன துணிக்கைகள்";
          body = "அஷா மற்றும் ரமன் வாழ்க்கையில் பலமுறை சந்திக்கப்பட்டனர். எதிர்பாராத ஒன்றுபட்டு காதலில் அவர்கள் இணைக்கப்பட்டனர்...";
          summary = "அஷா மற்றும் ரமன் உணர்ந்த காதல் கதை.";
        };
        hindi = {
          title = "टूटे हुए टुकड़े";
          body = "कई मुद्दों के बावजूद, आशा और रमन के जीवन में प्यार धीरे-धीरे जुड़ता गया...";
          summary = "आशा और रमन के प्यार का कहानी.";
        };
      };
      timestamp = 1641081600;
    },

    // Horror
    {
      id = 3;
      isKidFriendly = false;
      category = "Horror";
      author = "Admin";
      readTimeMinutes = 6;
      likes = 0;
      rating = 0;
      isPremium = false;
      coverImage = null;
      languages = {
        english = {
          title = "Midnight Whispers";
          body = "Sneha struggled to sleep as eerie whispers echoed in her room. Shadows on the walls grew long and menacing, making her heart pound. As the clock struck midnight, the whispers turned into sinister laughter, freezing Sneha in terror.";
          summary = "A horror story about chilling midnight whispers.";
        };
        tamil = {
          title = "நள்ளிரவு கிசுகிசுக்கள்";
          body = "சினேகா மிகவும் பயந்துபோய்ட்டிருந்தாள். சுவர்களில் நீண்ட நிழல்கள் தோன்றி, கிசுகிசுக்கள் கேட்ட மற்றியில் நள்ளிரவு...";
          summary = "நள்ளிரவு கிசுகிசுக்கள் பற்றிய ஒரு பயங்கரமான கதை.";
        };
        hindi = {
          title = "आधी रात की कानाफूसी";
          body = "श्रद्धा अपनी कहानी के मुख्य पात्र के जैसी हर पल विचित्र आवाज़ें सुनती रहती थी...";
          summary = "आधी रात की कानाफूसी और डर का किस्सा.";
        };
      };
      timestamp = 1641168000;
    },
    {
      id = 4;
      isKidFriendly = false;
      category = "Horror";
      author = "Admin";
      readTimeMinutes = 9;
      likes = 0;
      rating = 0;
      isPremium = true;
      coverImage = null;
      languages = {
        english = {
          title = "Haunted Forest";
          body = "Lost deep in the woods, Rahul and his friends stumbled upon a haunted cabin. Strange noises echoed, and mysterious lights flickered through the trees. The survivors never uttered a word about the horrors they witnessed that night.";
          summary = "A horror story set in a haunted forest.";
        };
        tamil = {
          title = "ஆவி காட்டு";
          body = "ஆழமான காட்டில், இருள் சூழ்ந்த இடத்தில், ராகுல் மற்றும் அவரது தோழர்கள் வட்டியில் நடந்தது...";
          summary = "ஆவி காட்டில் நடைபெற்ற சம்பவம் பற்றிய ஒரு கதை.";
        };
        hindi = {
          title = "भूतिया जंगल";
          body = "राहुल और उसके दोस्त कई दिनों तक जंगल में खोए रहे, हर रात एक नई डरावनी कहानी देती थी...";
          summary = "भूतिया जंगल का डरावना किस्सा.";
        };
      };
      timestamp = 1641254400;
    },

    // Thriller
    {
      id = 5;
      isKidFriendly = false;
      category = "Thriller";
      author = "Admin";
      readTimeMinutes = 6;
      likes = 0;
      rating = 0;
      isPremium = false;
      coverImage = null;
      languages = {
        english = {
          title = "The Disappearing Act";
          body = "Arjun couldn't believe his eyes when his friend vanished before him. Frantically searching, he encountered strange symbols and cryptic messages. Nothing was as it seemed in this twisted tale of deception and intrigue.";
          summary = "A thrilling story of mysterious disappearances.";
        };
        tamil = {
          title = "மாயைச் செயல்";
          body = "அர்ஜுனின் ஒருவரை காணும்போது அவர் காணவில்லை. அந்த காதலை இனிமையாகவே போய்விட்டது...";
          summary = "மாயை செயல் பற்றிய ஒருபுதுமையான கதை.";
        };
        hindi = {
          title = "गायब हो जाना";
          body = "अर्जुन अचानक अपने दोस्त को गायब होते देखकर हैरान रह गया...";
          summary = "गायब हो जाने की थ्रिलिंग कहानी.";
        };
      };
      timestamp = 1641340800;
    },
    {
      id = 6;
      isKidFriendly = false;
      category = "Thriller";
      author = "Admin";
      readTimeMinutes = 8;
      likes = 0;
      rating = 0;
      isPremium = true;
      coverImage = null;
      languages = {
        english = {
          title = "Cold Case Files";
          body = "Detective Maya investigated an unsolved mystery that left readers on the edge of their seats. Twists and turns at every corner made this thrilling adventure intense for all involved.";
          summary = "A thrilling detective story.";
        };
        tamil = {
          title = "குளிர் வழக்கு கோப்புகள்";
          body = "மாயா பயன்படுத்தும் தீவிர வழக்கு கோப்புகள் ஒரு கிளைமெக்ஸ் வழங்கியது...";
          summary = "குளிர் வழக்கு கோப்புகளின் தீவிரமான நடப்பு.";
        };
        hindi = {
          title = "कोल्ड केस फाइल्स";
          body = "गुप्तचरों का कोल्ड केस फाइल्स का जांच बहुत रोचक रहा...";
          summary = "कोल्ड केस फाइल्स की रोचक कहानी.";
        };
      };
      timestamp = 1641427200;
    },

    // Comedy
    {
      id = 7;
      isKidFriendly = true;
      category = "Comedy";
      author = "Admin";
      readTimeMinutes = 5;
      likes = 0;
      rating = 0;
      isPremium = false;
      coverImage = null;
      languages = {
        english = {
          title = "Pet Antics";
          body = "During a rainstorm, two playful pets caused chaos indoors. Their hilarious attempts to avoid getting wet left everyone laughing.";
          summary = "A funny story about pet antics.";
        };
        tamil = {
          title = "விலங்குகளின் உட்கார்வுகள்";
          body = "மழையில் நண்பர்கள் வீட்டிற்குள் கூடிய விபரீதங்களை நீக்குகிறது...";
          summary = "விலங்குகளின் சிறிய கதையாவும்.";
        };
        hindi = {
          title = "पालतू जानवरों की शरारत";
          body = "बारिश के मौसम में, दो पालतू जानवरों ने अपने मालिकों को हंसाया...";
          summary = "पालतू जानवरों की शरारतों की मजेदार कहानी.";
        };
      };
      timestamp = 1641513600;
    },
    {
      id = 8;
      isKidFriendly = true;
      category = "Comedy";
      author = "Admin";
      readTimeMinutes = 6;
      likes = 0;
      rating = 0;
      isPremium = false;
      coverImage = null;
      languages = {
        english = {
          title = "Frog Prince Misadventures";
          body = "When his secret was discovered, the frog prince stole a special golden ball, embarking on a series of humorous misadventures.";
          summary = "A hilarious adaptation of the frog prince.";
        };
        tamil = {
          title = "தொப்பி ராஜாவின் தவிர்ப்பு";
          body = "ராஜாவின் ஒளிப்படம் மற்றும் வெளியிடப்பட்ட கழிவுகளைச் சொல்வதிலிருந்து...";
          summary = "தொப்பி ராஜாவின் மிகச்சிறந்த கதையாவும்.";
        };
        hindi = {
          title = "ढोल वाले मेंढक की बेमेल कहानी";
          body = "अपने रहस्य को बनाए रखने के लिए मेंढक ने भौंका, जबकि उसके पास ढोल था...";
          summary = "ढोल वाले मेंढक की मजेदार कहानी.";
        };
      };
      timestamp = 1641600000;
    },

    // Kids Fairy Tales
    {
      id = 9;
      isKidFriendly = true;
      category = "Kids Fairy Tales";
      author = "Admin";
      readTimeMinutes = 5;
      likes = 0;
      rating = 0;
      isPremium = false;
      coverImage = null;
      languages = {
        english = {
          title = "The Kind Mouse";
          body = "This delightful story follows the adventures of a kind mouse who helps his animal friends and learns important lessons about friendship.";
          summary = "A kind mouse's adventures in the forest.";
        };
        tamil = {
          title = "நல்ல எலி";
          body = "ஒரு நல்ல எலியின் நட்பும் மற்றும் பழக்கங்களைப் பற்றியது...";
          summary = "நல்ல எலி மற்றும் நட்பு கதையாவும்...;";
        };
        hindi = {
          title = "दयालु चूहे की कहानी";
          body = "दयालु चूहे ने अजनबियों की मदद करके अपने पड़ोसियों का प्यार सम्मान पाया...";
          summary = "दयालु चूहे की प्रेरणादायक कहानी.";
        };
      };
      timestamp = 1641686400;
    },
    {
      id = 10;
      isKidFriendly = true;
      category = "Kids Fairy Tales";
      author = "Admin";
      readTimeMinutes = 6;
      likes = 0;
      rating = 0;
      isPremium = false;
      coverImage = null;
      languages = {
        english = {
          title = "Brave Bunny";
          body = "Despite being small, the brave bunny saved an entire field of vegetables and earned the animals' respect.";
          summary = "How the brave bunny became a hero.";
        };
        tamil = {
          title = "துணிச்சலான முயல்";
          body = "சிறிய முயல் தனது துணிச்சலால் வெற்றிக்கு சென்றது...";
          summary = "துணிச்சலான முயல் ஹீரோ ஆன கதை.";
        };
        hindi = {
          title = "बहादुर नन्हा खरगोश";
          body = "नन्हा खरगोश अपनी बहादुरी और होशियारी से गाँव में फेमस हो गया...";
          summary = "बहादुर खरगोश की प्रेरणादायक कहानी.";
        };
      };
      timestamp = 1641772800;
    },

    // Motivational
    {
      id = 11;
      isKidFriendly = true;
      category = "Motivational";
      author = "Admin";
      readTimeMinutes = 5;
      likes = 0;
      rating = 0;
      isPremium = false;
      coverImage = null;
      languages = {
        english = {
          title = "Believe in Yourself";
          body = "This uplifting tale encourages believing in yourself, helping readers overcome self-doubt and fears.";
          summary = "Believe in yourself and overcome challenges.";
        };
        tamil = {
          title = "உங்களை நம்புங்கள்";
          body = "உங்களை நம்பி கனவுகள் பூண செல்லுங்கள் என்பதில் ஊக்கம் தரும் கதை...";
          summary = "நம்பிக்கையின் வாழ்க்கையில் வெற்றிக்கான ஒரு கதையாவும்.";
        };
        hindi = {
          title = "खुद पर विश्वास रखें";
          body = "यह कहानी इस बारे में प्रेरित करती है कि खुद पर विश्वास रखकर कोई भी कितनी बड़ी उपलब्धियाँ पा सकता है...";
          summary = "खुद पर विश्वास रखें, सफलता आवश्य पाएँगे.";
        };
      };
      timestamp = 1641859200;
    },
    {
      id = 12;
      isKidFriendly = false;
      category = "Motivational";
      author = "Admin";
      readTimeMinutes = 8;
      likes = 0;
      rating = 0;
      isPremium = true;
      coverImage = null;
      languages = {
        english = {
          title = "The Road Less Travelled";
          body = "Sanjay's inspirational journey reminds us to take the road less traveled, finding courage in new beginnings.";
          summary = "Motivational story about forging your own path.";
        };
        tamil = {
          title = "உரியா பாதை";
          body = "உரிதிருப்பதுக்கான ஊக்கம் தரும் கதையாவும்...";
          summary = "உங்களுக்கு தேவையான ஊக்கம் ஒருரிதிருப்பதற்கான கதையாவும்.";
        };
        hindi = {
          title = "बदलाव की राह";
          body = "अपने मन का करने के लिए बदलाव की राह चुनना सिखाता है...";
          summary = "बदलाव के साथ आगे बढ़ने की प्रेरणादायक कहानी.";
        };
      };
      timestamp = 1641945600;
    },
  ];

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createAppUser() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create app user profiles");
    };

    let newUser : AppUser = {
      languagePreference = #english;
      favoriteStoryIds = [];
      lastReadStoryId = null;
      searchHistory = [];
      readingHistory = [];
      dailyStreak = 0;
      badgeAchievements = [];
      readingChallengeProgress = 0;
      adsWatched = 0;
      premiumSubscriptionActive = false;
    };
    users.add(caller, newUser);
  };

  public query ({ caller }) func getAppUser() : async AppUser {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access app user data");
    };

    switch (users.get(caller)) {
      case (?user) { user };
      case (null) { Runtime.trap("App user not found"); };
    };
  };

  public shared ({ caller }) func updateAppUser(updateFunc : AppUser) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update app user data");
    };

    users.add(caller, updateFunc);
  };

  public query ({ caller }) func getStory(storyId : Nat) : async Story {
    switch (stories.get(storyId)) {
      case (?story) { story };
      case (null) { Runtime.trap("Story not found."); };
    };
  };

  public query ({ caller }) func getUserFavoriteStories() : async [Story] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access favorites");
    };

    switch (users.get(caller)) {
      case (?user) {
        let nonNull = user.favoriteStoryIds.map(
          func(storyId) { stories.get(storyId) }
        ).filter(func(option) { option != null });
        nonNull.map(
          func(option) {
            switch (option) {
              case (?story) { story };
              case (null) { Runtime.trap("Unexpected null story") };
            };
          }
        );
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func publishStory(
    isKidFriendly : Bool,
    category : Text,
    author : Text,
    readTimeMinutes : Nat,
    isPremium : Bool,
    coverImage : ?Storage.ExternalBlob,
    english : Content,
    tamil : Content,
    hindi : Content,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish stories");
    };

    let storyId = stories.size() + 1;

    let newStory : Story = {
      id = storyId;
      isKidFriendly;
      category;
      author;
      readTimeMinutes;
      likes = 0;
      rating = 0;
      isPremium;
      coverImage;
      languages = {
        english;
        tamil;
        hindi;
      };
      timestamp = Time.now();
    };

    stories.add(storyId, newStory);
    storyId;
  };

  public shared ({ caller }) func toggleFavoriteStory(storyId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage favorites");
    };

    switch (users.get(caller)) {
      case (?user) {
        let isFavorite = user.favoriteStoryIds.any(func(id) { id == storyId });

        let updatedFavorites = if (isFavorite) {
          user.favoriteStoryIds.filter(func(id) { id != storyId });
        } else {
          user.favoriteStoryIds.concat([storyId]);
        };

        let updatedUser : AppUser = {
          languagePreference = user.languagePreference;
          favoriteStoryIds = updatedFavorites;
          lastReadStoryId = user.lastReadStoryId;
          searchHistory = user.searchHistory;
          readingHistory = user.readingHistory;
          dailyStreak = user.dailyStreak;
          badgeAchievements = user.badgeAchievements;
          readingChallengeProgress = user.readingChallengeProgress;
          adsWatched = user.adsWatched;
          premiumSubscriptionActive = user.premiumSubscriptionActive;
        };

        users.add(caller, updatedUser);
      };
      case (null) { Runtime.trap("App user not found"); };
    };
  };

  public query ({ caller }) func getFilteredSortedStories(
    _language : Language,
    sortByPopularity : ?Bool,
    filterByCategory : ?Text,
    filterByKidFriendly : ?Bool,
  ) : async [Story] {
    let filteredStories = stories.values().toArray().filter(
      func(story) {
        let matchesLanguage = story.languages.english.title != "";
        let matchesCategory = switch (filterByCategory) {
          case (?category) { story.category == category };
          case (null) { true };
        };
        let matchesKidFriendly = switch (filterByKidFriendly) {
          case (?isKidFriendly) { story.isKidFriendly == isKidFriendly };
          case (null) { true };
        };

        matchesLanguage and matchesCategory and matchesKidFriendly;
      }
    );

    switch (sortByPopularity) {
      case (?popularity) {
        if (popularity) {
          filteredStories.sort(Story.compareByNewest);
        } else {
          filteredStories;
        };
      };
      case (null) { filteredStories };
    };
  };

  public query ({ caller }) func getDailyFeaturedStoryByLanguage(_language : Language) : async Story {
    let allStories = stories.values().toArray();
    if (allStories.size() == 0) {
      Runtime.trap("No stories available.");
    };
    allStories[0];
  };

  public shared ({ caller }) func addStoryDraft(text : Text, image : ?Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create story drafts");
    };

    if (text == "") { Runtime.trap("Text content cannot be empty"); };

    let draftId = Time.now().toNat();
    let newDraft : StoryDraft = {
      id = draftId;
      text;
      image;
      createdAt = Time.now();
      isPrivate = false;
      authorRole = "user";
    };

    let currentDrafts = switch (storyDrafts.get(caller)) {
      case (?drafts) { drafts };
      case (null) { List.empty<StoryDraft>() };
    };

    currentDrafts.add(newDraft);
    storyDrafts.add(caller, currentDrafts);

    draftId;
  };

  public query ({ caller }) func getStoryDraft(draftId : Nat) : async ?StoryDraft {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access story drafts");
    };

    switch (storyDrafts.get(caller)) {
      case (?drafts) {
        let filtered = drafts.filter(func(d) { d.id == draftId });
        switch (filtered.size()) {
          case (0) { null };
          case (_) { ?filtered.values().toArray()[0] };
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getMyStoryDrafts() : async [StoryDraft] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access story drafts");
    };

    switch (storyDrafts.get(caller)) {
      case (?drafts) { drafts.values().toArray() };
      case (null) { [] };
    };
  };
};

