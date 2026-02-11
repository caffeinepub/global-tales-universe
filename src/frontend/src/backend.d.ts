import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Content {
    title: string;
    body: string;
    summary: string;
}
export interface AppUser {
    favoriteStoryIds: Array<bigint>;
    readingHistory: Array<bigint>;
    lastReadStoryId?: bigint;
    language: Language;
    readingChallengeProgress: bigint;
    searchHistory: Array<string>;
    dailyStreak: bigint;
    adsWatched: bigint;
    premiumSubscriptionActive: boolean;
    badgeAchievements: Array<string>;
}
export interface UserProfile {
    name: string;
}
export interface Story {
    id: bigint;
    coverImageUrl: string;
    isPremium: boolean;
    languages: {
        tamil: Content;
        hindi: Content;
        english: Content;
    };
    author: string;
    likes: bigint;
    timestamp: bigint;
    category: string;
    rating: bigint;
    isKidFriendly: boolean;
    readTimeMinutes: bigint;
}
export enum Language {
    tamil = "tamil",
    hindi = "hindi",
    english = "english"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAppUser(): Promise<void>;
    getAppUser(): Promise<AppUser>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyFeaturedStoryByLanguage(language: Language): Promise<Story>;
    getFilteredSortedStories(language: Language, sortByPopularity: boolean | null, filterByCategory: string | null, filterByKidFriendly: boolean | null): Promise<Array<Story>>;
    getStory(storyId: bigint): Promise<Story>;
    getUserFavoriteStories(): Promise<Array<Story>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    publishStory(isKidFriendly: boolean, category: string, author: string, readTimeMinutes: bigint, isPremium: boolean, coverImageUrl: string, english: Content, tamil: Content, hindi: Content): Promise<bigint>;
    saveAppUser(appUser: AppUser): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleFavoriteStory(storyId: bigint): Promise<void>;
}
