import { usePreferences } from '../context/PreferencesContext';
import { useAppUser } from '../hooks/useAppUser';
import { useUserProfile } from '../hooks/useUserProfile';
import { t } from '../lib/i18n';
import LoginButton from '../components/LoginButton';
import UserAvatar from '../components/UserAvatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import { getEngagementData } from '../lib/engagement';
import { Badge } from '../components/ui/badge';
import { Flame, Award, Target, Upload, Link as LinkIcon, Crown, Share2, Bell, BellOff } from 'lucide-react';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { useState, useEffect, useRef } from 'react';
import { validateUsername, validateImageFile, validateImageUrl } from '../lib/profileValidation';
import { toast } from 'sonner';
import { shareApp } from '../lib/share';
import { recordShare } from '../lib/engagement';
import { 
  isNotificationSupported, 
  canShowNotifications, 
  requestNotificationPermission, 
  showTestNotification,
  isNotificationDenied 
} from '../lib/notifications';

export default function ProfileTab() {
  const { language } = usePreferences();
  const { isAuthenticated, isPremium, dailyNotificationsEnabled, updateUserState } = useAppUser();
  const { profile: getProfile, saveProfile, isLoading: profileLoading, isSaving, isFetched } = useUserProfile();
  const navigate = useNavigate();
  const engagement = getEngagementData();

  const [currentProfile, setCurrentProfile] = useState<{ name: string; image?: string }>({ name: 'Guest' });
  const [editedName, setEditedName] = useState('');
  const [editedImage, setEditedImage] = useState<string | File | undefined>();
  const [imageUrl, setImageUrl] = useState('');
  const [nameError, setNameError] = useState('');
  const [imageError, setImageError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(dailyNotificationsEnabled);

  // Load current profile
  useEffect(() => {
    getProfile().then(profile => {
      setCurrentProfile(profile);
      setEditedName(profile.name);
      if (profile.image) {
        setEditedImage(profile.image);
      }
    });
  }, [getProfile, isFetched]);

  // Sync notifications state
  useEffect(() => {
    setNotificationsEnabled(dailyNotificationsEnabled);
  }, [dailyNotificationsEnabled]);

  const handleNameChange = (value: string) => {
    setEditedName(value);
    const validation = validateUsername(value);
    setNameError(validation.valid ? '' : validation.error || '');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setImageError(validation.error || '');
      toast.error(validation.error);
      return;
    }

    setImageError('');
    setEditedImage(file);
    
    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      // Preview will be shown via editedImage state
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      setImageError('Please enter a URL');
      return;
    }

    const validation = validateImageUrl(imageUrl);
    if (!validation.valid) {
      setImageError(validation.error || '');
      toast.error(validation.error);
      return;
    }

    setImageError('');
    setEditedImage(imageUrl);
    setImageUrl('');
  };

  const handleSave = async () => {
    // Validate username
    const validation = validateUsername(editedName);
    if (!validation.valid) {
      setNameError(validation.error || '');
      toast.error(validation.error);
      return;
    }

    try {
      await saveProfile({
        name: editedName,
        image: editedImage,
      });
      
      toast.success('Profile updated!');
      
      // Refresh current profile
      const updated = await getProfile();
      setCurrentProfile(updated);
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  const handleCancelSubscription = () => {
    updateUserState({ isPremium: false });
    toast.success('Subscription cancelled. You are now on the free plan.');
  };

  const handleShareApp = async () => {
    setIsSharing(true);
    const success = await shareApp();
    if (success) {
      const data = recordShare();
      if (data.bonusStoriesUnlocked > 0) {
        toast.success('Bonus story unlocked! 🎉');
      }
    }
    setIsSharing(false);
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (!isNotificationSupported()) {
      toast.error('Notifications are not supported in your browser.');
      return;
    }

    if (enabled) {
      // Request permission if not granted
      if (!canShowNotifications()) {
        const permission = await requestNotificationPermission();
        
        if (permission === 'granted') {
          // Show test notification
          const shown = showTestNotification();
          if (shown) {
            setNotificationsEnabled(true);
            updateUserState({ dailyNotificationsEnabled: true });
            toast.success('Daily notifications enabled!');
          } else {
            toast.error('Failed to show notification.');
          }
        } else if (permission === 'denied') {
          toast.error('Notification permission denied. Please enable it in your browser settings.');
        } else {
          toast.info('Notification permission not granted.');
        }
      } else {
        // Already have permission, just enable
        showTestNotification();
        setNotificationsEnabled(true);
        updateUserState({ dailyNotificationsEnabled: true });
        toast.success('Daily notifications enabled!');
      }
    } else {
      // Disable notifications
      setNotificationsEnabled(false);
      updateUserState({ dailyNotificationsEnabled: false });
      toast.info('Daily notifications disabled.');
    }
  };

  const hasChanges = editedName !== currentProfile.name || editedImage !== currentProfile.image;
  const canSave = hasChanges && !nameError && !isSaving;

  // Get preview URL for display
  const getPreviewUrl = (): string | undefined => {
    if (!editedImage) return currentProfile.image;
    if (typeof editedImage === 'string') return editedImage;
    return URL.createObjectURL(editedImage);
  };

  const notificationSupported = isNotificationSupported();
  const notificationDenied = isNotificationDenied();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('profile', language)}</h1>
        <LoginButton />
      </div>

      {/* Profile Edit Section */}
      <div className="bg-card rounded-xl p-6 space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <UserAvatar 
              imageUrl={getPreviewUrl()} 
              name={editedName}
              size="large"
              isLoading={isSaving}
            />
            {isPremium && (
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-background">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold">{currentProfile.name}</span>
            {isPremium && (
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          
          <div className="w-full max-w-md space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editedName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your username"
                className={nameError ? 'border-destructive' : ''}
              />
              {nameError && (
                <p className="text-sm text-destructive">{nameError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              
              <div className="space-y-3">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image (JPG/PNG, max 2MB)
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">OR</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUrlSubmit}
                  >
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {imageError && (
                <p className="text-sm text-destructive">{imageError}</p>
              )}
            </div>

            <Button
              onClick={handleSave}
              disabled={!canSave}
              className="w-full"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="bg-card rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{engagement.streak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
          {!isPremium ? (
            <Button variant="outline" onClick={() => navigate({ to: '/premium' })}>
              {t('goPremium', language)}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleCancelSubscription}>
              Cancel Subscription
            </Button>
          )}
        </div>

        {engagement.badges.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5" />
              <h3 className="font-semibold">Badges</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {engagement.badges.map((badge) => (
                <Badge key={badge} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5" />
            <h3 className="font-semibold">Reading Challenge</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Read 5 stories this week: {engagement.challengeProgress}/5
          </p>
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="bg-card rounded-xl p-6 space-y-4">
        <h3 className="font-semibold">Notifications</h3>
        
        {notificationSupported ? (
          <>
            <p className="text-sm text-muted-foreground">
              Allow notifications for daily new stories?
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notificationsEnabled ? (
                  <Bell className="w-5 h-5 text-primary" />
                ) : (
                  <BellOff className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Enable Daily Story Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Get notified when new stories arrive
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
                disabled={notificationDenied}
              />
            </div>

            {notificationDenied && (
              <p className="text-xs text-destructive">
                Notifications are blocked. Please enable them in your browser settings.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Notifications are not supported in your browser.
          </p>
        )}
      </div>

      {/* Share App */}
      <div className="bg-card rounded-xl p-6">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleShareApp}
          disabled={isSharing}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Invite Friends – Share App
        </Button>
      </div>

      {/* Settings */}
      <div className="bg-card rounded-xl p-6">
        <h3 className="font-semibold mb-4">{t('settings', language)}</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('language', language)}</span>
            <span className="font-medium">{language.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Status</span>
            <span className="font-medium">{isAuthenticated ? 'Signed In' : 'Guest'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subscription</span>
            <span className="font-medium">{isPremium ? 'Premium' : 'Free'}</span>
          </div>
        </div>
      </div>

      {/* Legal & Support */}
      <div className="bg-card rounded-xl p-6">
        <h3 className="font-semibold mb-4">Legal & Support</h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate({ to: '/privacy-policy' })}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
          >
            Privacy Policy
          </button>
          <Separator />
          <button
            onClick={() => navigate({ to: '/terms-and-conditions' })}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
          >
            Terms and Conditions
          </button>
          <Separator />
          <button
            onClick={() => navigate({ to: '/help-and-support' })}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
          >
            Help and Support
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground py-6">
        <p>© {new Date().getFullYear()} Global Tales Universe</p>
        <p className="mt-2">
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
