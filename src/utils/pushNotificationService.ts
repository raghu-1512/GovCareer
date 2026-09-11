/**
 * Client-Side Push Notification Service
 * Manages Service Worker Push Subscriptions & VAPID Key Synchronization
 */

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export interface PushStatus {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  endpoint?: string;
}

export async function getPushSubscriptionStatus(): Promise<PushStatus> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return {
      isSupported: false,
      permission: 'denied',
      isSubscribed: false,
    };
  }

  const permission = Notification.permission;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return {
      isSupported: true,
      permission,
      isSubscribed: !!sub,
      endpoint: sub ? sub.endpoint : undefined,
    };
  } catch (err) {
    console.warn('Error querying push subscription:', err);
    return {
      isSupported: true,
      permission,
      isSubscribed: false,
    };
  }
}

export async function subscribeToPushNotifications(userId?: string): Promise<{ success: boolean; message: string }> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return {
      success: false,
      message: 'Push notifications are not supported by this browser.',
    };
  }

  try {
    // 1. Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        message: 'Notification permission was denied. Please allow notifications in browser settings.',
      };
    }

    // 2. Fetch VAPID Public Key from server
    const vapidRes = await fetch('/api/push/vapid-public-key');
    if (!vapidRes.ok) {
      throw new Error('Failed to retrieve VAPID public key from backend server.');
    }
    const { publicKey } = await vapidRes.json();

    // 3. Register service worker and subscribe to PushManager
    const registration = await navigator.serviceWorker.ready;
    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as any,
    });

    // 4. Send subscription credentials to backend server
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        userId: userId || 'anonymous',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save push subscription on the backend.');
    }

    // Trigger an immediate welcome notification via native notification API as fallback confirmation
    if (Notification.permission === 'granted') {
      registration.showNotification('🎉 GovCareer Push Notifications Active!', {
        body: 'You will now receive instant push alerts whenever verified government jobs or exam schedules are posted.',
        icon: '/icon-192.png',
        badge: '/icon-192-maskable.png',
        tag: 'govcareer-welcome',
      });
    }

    return {
      success: true,
      message: 'Push notifications enabled successfully! You will get instant alerts when new jobs are posted.',
    };
  } catch (err: any) {
    console.error('Error subscribing to push notifications:', err);
    return {
      success: false,
      message: err.message || 'Failed to subscribe to push notifications.',
    };
  }
}

export async function unsubscribeFromPushNotifications(): Promise<{ success: boolean; message: string }> {
  if (!('serviceWorker' in navigator)) {
    return { success: false, message: 'Service worker not found.' };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();

      // Tell backend to remove
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint }),
      });
    }

    return {
      success: true,
      message: 'Push notifications have been disabled for this device.',
    };
  } catch (err: any) {
    console.error('Error unsubscribing:', err);
    return {
      success: false,
      message: err.message || 'Failed to unsubscribe.',
    };
  }
}

export async function sendTestPushAlert(customTitle?: string, customBody?: string): Promise<{ success: boolean; message: string }> {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();

    const response = await fetch('/api/push/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: customTitle || '🚨 New Govt Vacancy: UPSC Civil Services 2026',
        body: customBody || 'UPSC has released notification for 1,056 vacancies. Application portal is now live.',
        url: '/?tab=search',
        subscription: sub ? sub.toJSON() : undefined,
      }),
    });

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Test push alert sent to your device.',
    };
  } catch (err: any) {
    console.error('Error sending test push:', err);
    return {
      success: false,
      message: err.message || 'Failed to send test push alert.',
    };
  }
}
