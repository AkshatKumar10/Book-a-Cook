import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const getFcmToken = async () => {
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return null;
  }

  try {
    const deviceToken = await Notifications.getDevicePushTokenAsync();
    return deviceToken.data; 
  } catch (error) {
    console.error('Error getting device push token:', error);
    return null;
  }
};