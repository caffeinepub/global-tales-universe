/**
 * Check if Notifications API is supported
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | null {
  if (!isNotificationSupported()) {
    return null;
  }
  return Notification.permission;
}

/**
 * Check if notifications can be shown
 */
export function canShowNotifications(): boolean {
  return isNotificationSupported() && Notification.permission === 'granted';
}

/**
 * Check if notification permission was denied
 */
export function isNotificationDenied(): boolean {
  return isNotificationSupported() && Notification.permission === 'denied';
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | null> {
  if (!isNotificationSupported()) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.warn('Failed to request notification permission:', error);
    return null;
  }
}

/**
 * Show a test notification
 */
export function showTestNotification(): boolean {
  if (!canShowNotifications()) {
    return false;
  }

  try {
    const notification = new Notification('New story added!', {
      body: 'Open app to read today\'s motivational tale.',
      icon: '/assets/generated/gtu-app-icon.dim_192x192.png',
      badge: '/assets/generated/gtu-app-icon.dim_192x192.png',
      tag: 'daily-story',
      requireInteraction: false,
    });

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    // Handle click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (error) {
    console.warn('Failed to show notification:', error);
    return false;
  }
}
