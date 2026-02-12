import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useRouterState } from '@tanstack/react-router';
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
import GoPremium from './pages/GoPremium';
import PremiumSuccess from './pages/PremiumSuccess';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import HelpAndSupport from './pages/HelpAndSupport';
import AboutUs from './pages/AboutUs';
import { PreferencesProvider } from './context/PreferencesContext';
import { Toaster } from './components/ui/sonner';
import ReminderBanner from './components/ReminderBanner';
import InstallPromptBanner from './components/InstallPromptBanner';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import { registerServiceWorker } from './pwa/registerServiceWorker';
import { isOnboardingCompleted } from './lib/onboarding';

function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Check if current route is StoryReader (full-screen experience)
  const isStoryReader = currentPath.startsWith('/story/');
  const isPremiumSuccess = currentPath === '/premium/success';

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Check if onboarding is needed after splash
      const completed = isOnboardingCompleted();
      setOnboardingCompleted(completed);
      setShowOnboarding(!completed);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
  }, []);

  useEffect(() => {
    // Auto-open drawer for preview if URL param is present
    const params = new URLSearchParams(window.location.search);
    if (params.get('preview') === 'drawer') {
      setDrawerOpen(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setOnboardingCompleted(true);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // StoryReader and PremiumSuccess have their own layouts
  if (isStoryReader || isPremiumSuccess) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader onMenuClick={() => setDrawerOpen(true)} />
      <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ReminderBanner />
      <InstallPromptBanner />
      <main className="flex-1 overflow-auto pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
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

const storyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/story/$storyId',
  component: StoryReader,
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

const routeTree = rootRoute.addChildren([
  homeRoute,
  categoriesRoute,
  categoryDetailRoute,
  searchRoute,
  favoritesRoute,
  profileRoute,
  storyRoute,
  premiumRoute,
  premiumSuccessRoute,
  privacyPolicyRoute,
  termsAndConditionsRoute,
  helpAndSupportRoute,
  aboutUsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PreferencesProvider>
        <RouterProvider router={router} />
        <Toaster />
      </PreferencesProvider>
    </ThemeProvider>
  );
}
