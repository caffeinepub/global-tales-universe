import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
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
    coverImageUrl : Text;
    languages : {
      english : Content;
      tamil : Content;
      hindi : Content;
    };
    timestamp : Int;
  };

  type AppUser = {
    language : Language;
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

  // User profile type for frontend compatibility
  public type UserProfile = {
    name : Text;
  };

  // Module for Story comparison logic.
  module Story {
    public func compareByNewest(story1 : Story, story2 : Story) : Order.Order {
      if (story1.timestamp > story2.timestamp) {
        #less;
      } else if (story1.timestamp < story2.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  let stories = Map.empty<Nat, Story>();
  let users = Map.empty<Principal, AppUser>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management (required by frontend)
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

  // Core AppUser management functions.
  public shared ({ caller }) func createAppUser() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create app user profiles");
    };

    let newUser : AppUser = {
      language = #english;
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
      case (null) { Runtime.trap("Not found.") };
    };
  };

  public shared ({ caller }) func saveAppUser(appUser : AppUser) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save app user data");
    };

    users.add(caller, appUser);
  };

  public query ({ caller }) func getStory(storyId : Nat) : async Story {
    // Public access - guests can browse stories
    switch (stories.get(storyId)) {
      case (?story) { story };
      case (null) { Runtime.trap("Not found.") };
    };
  };

  public query ({ caller }) func getUserFavoriteStories() : async [Story] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access favorites");
    };

    switch (users.get(caller)) {
      case (?user) {
        // Convert favoriteStoryIds to an Array of Stories using flatMap
        let favorites = user.favoriteStoryIds.map(func(storyId) { stories.get(storyId) });
        // Remove null or empty stories using filter
        let nonNull = favorites.filter(func(option) { option != null });
        // Convert from iter<Story> to [Story] with map and iter
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
    coverImageUrl : Text,
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
      coverImageUrl;
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
          language = user.language;
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
      case (null) { Runtime.trap("User not found.") };
    };
  };

  public shared ({ caller }) func getFilteredSortedStories(
    language : Language,
    sortByPopularity : ?Bool,
    filterByCategory : ?Text,
    filterByKidFriendly : ?Bool,
  ) : async [Story] {
    // Public access - guests can browse and search stories
    let allStories : List.List<Story> = List.empty<Story>();

    stories.values().forEach(
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

        if (matchesLanguage and matchesCategory and matchesKidFriendly) {
          allStories.add(story);
        };
      }
    );

    let sortedStories = switch (sortByPopularity) {
      case (?popularity) {
        if (popularity) {
          allStories.toArray().sort(Story.compareByNewest);
        } else {
          allStories.toArray();
        };
      };
      case (null) { allStories.toArray() };
    };

    sortedStories;
  };

  public query ({ caller }) func getDailyFeaturedStoryByLanguage(language : Language) : async Story {
    let allStories = stories.values().toArray();
    if (allStories.size() == 0) {
      Runtime.trap("No stories available.");
    };
    allStories[0];
  };
};
