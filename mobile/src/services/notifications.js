import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const REMINDER_CHANNEL = 'tour-reminders';
const DEFAULT_CHANNEL = 'default';

/**
 * Register for push notifications and get Expo push token.
 */
export async function registerForPushNotifications() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL, {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1A3557',
    });
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL, {
      name: 'Tour Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2ECC8A',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return null;
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (error) {
    console.warn('Failed to get push token:', error);
    return null;
  }

  return token;
}

/**
 * Schedule a local notification for a tour reminder (24 hours before).
 * Returns the notification identifier so it can be cancelled later.
 */
export async function scheduleTourReminder(bookingId, centerName, date, time) {
  try {
    const tourDate = new Date(date);
    const reminderDate = new Date(tourDate.getTime() - 24 * 60 * 60 * 1000);

    // Only schedule if the reminder time is in the future
    if (reminderDate <= new Date()) {
      return null;
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Tour Reminder',
        body: `Reminder: Your tour at ${centerName} is tomorrow at ${time}!`,
        data: { type: 'tour_reminder', bookingId, centerName },
        sound: true,
        ...(Platform.OS === 'android' ? { channelId: REMINDER_CHANNEL } : {}),
      },
      trigger: {
        date: reminderDate,
        channelId: REMINDER_CHANNEL,
      },
    });

    return identifier;
  } catch (error) {
    console.warn('Failed to schedule tour reminder:', error);
    return null;
  }
}

/**
 * Cancel a scheduled notification by identifier.
 */
export async function cancelNotification(identifier) {
  try {
    if (identifier) {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    }
  } catch (error) {
    console.warn('Failed to cancel notification:', error);
  }
}

/**
 * Cancel all scheduled notifications (e.g., on logout).
 */
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn('Failed to cancel all notifications:', error);
  }
}

/**
 * Schedule an immediate local notification.
 */
export async function scheduleLocalNotification(title, body, data = {}) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null,
    });
  } catch (error) {
    console.warn('Failed to schedule notification:', error);
  }
}

/**
 * Add a listener for when user taps a notification response.
 */
export function addNotificationResponseListener(handler) {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      handler(response.notification.request.content.data);
    }
  );
  return subscription;
}

/**
 * Add a listener for when a notification is received while app is foregrounded.
 */
export function addNotificationReceivedListener(handler) {
  const subscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      handler(notification);
    }
  );
  return subscription;
}

/**
 * Get all scheduled notifications (for debugging).
 */
export async function getAllScheduledNotifications() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn('Failed to get scheduled notifications:', error);
    return [];
  }
}