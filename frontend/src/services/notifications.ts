import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Qué debe hacer la notificación cuando llega
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Pedir permiso para enviar notificaciones
export const requestNotificationPermissions = async () => {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  if (existingStatus === "granted") {
    return true;
  }

  const { status } =
    await Notifications.requestPermissionsAsync();

  return status === "granted";
};

// Crear la alarma
export const scheduleMedicationAlarm = async (
  medicationName: string,
  hour: number,
  minute: number
) => {

  const permission =
    await requestNotificationPermissions();

  if (!permission) {
    console.log("No se dieron permisos para las notificaciones");
    return null;
  }

  // Configuración para Android
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      "medications",
      {
        name: "Recordatorios de medicamentos",
        importance:
          Notifications.AndroidImportance.MAX,
        sound: "default",
      }
    );
  }

  // Programar alarma diaria
  const notificationId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💊 Recordatorio de medicamento",
        body: `Es hora de tomar ${medicationName}`,
        sound: "default",
      },

      trigger: {
        type:
          Notifications.SchedulableTriggerInputTypes
            .DAILY,
        hour,
        minute,
      },
    });

  console.log(
    "Alarma programada:",
    notificationId
  );

  return notificationId;
};