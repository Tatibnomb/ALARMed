import { useEffect, useRef, useState } from "react";

const nowHHMM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export default function useReminders(doses, takenToday) {
  const [now, setNow] = useState(nowHHMM());
  const notified = useRef(new Set());
  const [permission, setPermission] = useState(
    "Notification" in window ? Notification.permission : "unsupported"
  );

  // Actualiza la hora cada 30 segundos
  useEffect(() => {
    const id = setInterval(() => setNow(nowHHMM()), 30000);
    return () => clearInterval(id);
  }, []);

  // Tomas cuya hora ya llegó (o pasó) y siguen sin marcarse
  const dueDoses = doses.filter(
    (d) => d.hour <= now && !takenToday.has(d.medication.id)
  );

  // Dispara la notificación del navegador una sola vez por toma
  useEffect(() => {
    if (permission !== "granted") return;

    const today = new Date().toDateString();

    dueDoses.forEach((d) => {
      const id = `${d.key}-${today}`;
      if (d.hour === now && !notified.current.has(id)) {
        notified.current.add(id);
        new Notification("ALARMed 💊", {
          body: `Es hora de tomar ${d.medication.name} (${d.medication.dosage})`,
        });
      }
    });
  }, [now, permission]); // eslint-disable-line react-hooks/exhaustive-deps

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    setPermission(await Notification.requestPermission());
  };

  return { now, dueDoses, permission, requestPermission };
}