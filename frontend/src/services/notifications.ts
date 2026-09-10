import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configuramos qué debe hacer la notificación // cuando llega al celular.
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

// Programa una alarma para una fecha y hora determinada.
export const scheduleMedicationAlarm = async (
  medicationName: string,
  date: string,
  hour: string
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

  // Separamos la hora.
  // Ejemplo: "08:30" → hora = 8, minutos = 30
const [hours, minutes] = hour.split(":").map(Number);
// Separamos la fecha.
// Ejemplo: "2026-09-10"
const [year, month, day] = date.split("-").map(Number);
const notificationDate = new Date( year, month - 1, day, hours, minutes, 0, 0 );
// Si la fecha ya pasó, no programamos la alarma.
if (notificationDate.getTime() <= Date.now()) {
  console.log( "La fecha y hora seleccionadas ya pasaron."
  );
  return null;
}
// Programamos la notificación para esa fecha.
const notificationId = await Notifications.scheduleNotificationAsync({
  content: {
    title: "💊 Recordatorio de medicamento",
    body: `Es hora de tomar ${medicationName}`,
    sound: "default",
  },
  trigger: { type: Notifications.SchedulableTriggerInputTypes
    .DATE, date: notificationDate, channelId: Platform.OS === "android" ? "medications" : undefined, }, });
    console.log( "Alarma programada:", notificationId ); console.log( "Fecha de alarma:", notificationDate ); return notificationId; };