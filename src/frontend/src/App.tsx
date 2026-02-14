import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useRouterState, NotFoundRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import SplashScreen from './components/SplashScreen';
import BottomNav from './components/BottomNav';
import AppHeader from './components/AppHeader';
import AppDrawer from './components/AppDrawer';
import HomeTab from './pages/HomeTab';
import CategoriesTab from './pages/CategoriesTab';
import CategoryDetail from './pages/CategoryDetail';
import SearchTab from './pages/SearchTab';
import FavoritesTab from './pages/FavoritesTab';
import ProfileTab from './pages/ProfileTab';
import StoryReader from './pages/StoryReader';
import StoryEditor from './pages/StoryEditor';
import MyStories from './pages/MyStories';
import GoPremium from './pages/GoPremium';
import PremiumSuccess from './pages/PremiumSuccess';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import HelpAndSupport from './pages/HelpAndSupport';
import AboutUs from './pages/AboutUs';
import RouteErrorFallback from './components/RouteErrorFallback';
import NavDebugOverlay from './components/NavDebugOverlay';
import { PreferencesProvider } from './context/PreferencesContext';
import { Toaster } from './components/ui/sonner';
import ReminderBanner from './components/ReminderBanner';
import InstallPromptBanner from './components/InstallPromptBanner';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import { registerServiceWorker } from './pwa/registerServiceWorker';
import { isOnboardingCompleted } from './lib/onboarding';
import { getSearchString } from './lib/routerSearch';

function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentSearch = routerState.location.search;
  const searchString = getSearchString(currentSearch);

  // Check if current route is StoryReader or StoryEditor (full-screen experience)
  const isStoryReader = currentPath.startsWith('/story/') && !currentPath.includes('/editor');
  const isStoryEditor = currentPath === '/story-editor';
  const isPremiumSuccess = currentPath === '/premium/success';

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Register service worker for PWA functionality
    // The helper now handles preview mode detection and unregistration
    registerServiceWorker();
  }, []);

  useEffect(() => {
    // Auto-open drawer for preview if URL param is present
    const params = new URLSearchParams(window.location.search);
    if (params.get('preview') === 'drawer') {
      setDrawerOpen(true);
    }
  }, []);

  useEffect(() => {
    // Dev-only: Log button style verification checklist
    if (import.meta.env.DEV) {
      console.log(
        '%c🔍 Button Style Regression Check',
        'background: #4338ca; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
        '\n\nVerify button styling on these screens after Preview/Production builds:\n' +
        '1. Premium page (/premium) - Check default & outline button variants\n' +
        '2. Error fallback (navigate to /nonexistent) - Check default button variant\n' +
        '\nExpected: Buttons should have visible padding, background, border, hover & focus states.\n' +
        'If buttons look like plain text, CSS variable tokens may be broken.\n'
      );
    }
  }, []);

  // Scroll to top on route change to ensure fresh page view
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath, searchString]);

  if (showSplash) {
    return <SplashScreen />;
  }

  // StoryReader, StoryEditor, and PremiumSuccess have their own layouts
  if (isStoryReader || isStoryEditor || isPremiumSuccess) {
    return (
      <div key={`${currentPath}-${searchString}`}>
        <NavDebugOverlay />
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-h-screen bg-background overflow-hidden">
      <NavDebugOverlay />
      <AppHeader onMenuClick={() => setDrawerOpen(true)} />
      <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ReminderBanner />
      <InstallPromptBanner />
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 sm:pb-24" key={`${currentPath}-${searchString}`}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteErrorFallback,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeTab,
});

const categoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/categories',
  component: CategoriesTab,
});

const categoryDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/categories/$categoryId',
  component: CategoryDetail,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchTab,
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/favorites',
  component: FavoritesTab,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfileTab,
});

const myStoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-stories',
  component: MyStories,
});

const storyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/story/$storyId',
  component: StoryReader,
});

const storyEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/story-editor',
  component: StoryEditor,
});

const premiumRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/premium',
  component: GoPremium,
});

const premiumSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/premium/success',
  component: PremiumSuccess,
});

// Primary routes for legal/support pages
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPolicy,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsAndConditions,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpAndSupport,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutUs,
});

// Alias routes for alternate paths used by UI components
const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: PrivacyPolicy,
});

const termsAndConditionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms-and-conditions',
  component: TermsAndConditions,
});

const helpAndSupportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help-and-support',
  component: HelpAndSupport,
});

const aboutUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about-us',
  component: AboutUs,
});

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: RouteErrorFallback,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  categoriesRoute,
  categoryDetailRoute,
  searchRoute,
  favoritesRoute,
  profileRoute,
  myStoriesRoute,
  storyRoute,
  storyEditorRoute,
  premiumRoute,
  premiumSuccessRoute,
  privacyRoute,
  termsRoute,
  helpRoute,
  aboutRoute,
  privacyPolicyRoute,
  termsAndConditionsRoute,
  helpAndSupportRoute,
  aboutUsRoute,
]);

const router = createRouter({
  routeTree,
  notFoundRoute,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(!isOnboardingCompleted());

  if (showOnboarding) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <PreferencesProvider>
          <RouterProvider router={router} />
          <Toaster />
        </PreferencesProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
