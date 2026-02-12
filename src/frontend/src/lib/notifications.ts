/**
 * Notification utilities with clear permission state helpers
 * (supported, denied, granted, default) and consistent test notification behavior.
 */

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'default';
  return Notification.permission;
}

export function isNotificationDenied(): boolean {
  return getNotificationPermission() === 'denied';
}

export function isNotificationGranted(): boolean {
  return getNotificationPermission() === 'granted';
}

export function canShowNotifications(): boolean {
  return isNotificationSupported() && isNotificationGranted();
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'default';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return 'default';
  }
}

export function showTestNotification(): boolean {
  if (!canShowNotifications()) {
    return false;
  }

  try {
    new Notification('GTU Notifications Enabled', {
      body: 'You will receive daily story notifications.',
      icon: '/assets/generated/gtu-app-icon.dim_192x192.png',
      badge: '/assets/generated/gtu-app-icon.dim_192x192.png',
    });
    return true;
  } catch (error) {
    console.error('Failed to show notification:', error);
    return false;
  }
}
