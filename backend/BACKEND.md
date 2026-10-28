# ALARMed - Backend API

## Tablas de la base de datos (en Supabase)

## Tabla users
Almacena información de usuarios.
Campos:
- id
- name
- email
- created_at

## Tabla medications
Almacena medicamentos asociados a un usuario.
Campos:
- id
- user_id
- name
- dosage (dósis del medicamento)
- description
- frequency (cada tantas horas lo tiene que volver a tomar)
- created_at

## Tabla schedules
Guarda horarios configurados para medicamentos.
Campos:
- id
- medication_id
- hour

## Tabla intakes
Registra si un medicamento fue tomado o no.
Campos:
- id
- medication_id
- taken (true o false dependiendo de si indicó que lo tomó o no)
- taken_at

## warnings
Advertencias de salud generadas con IA.
- id (uuid)
- user_id → users.id
- type: interaction, administration, contraindication, duplicate o precaution
- severity: info, precaucion, importante o urgente
- title, message, recommendation
- evidence_level: alto, moderado o limitado
- source
- created_at

## warning_medications
Tabla intermedia (relación muchos a muchos): una advertencia puede involucrar varios medicamentos.
- warning_id → warnings.id
- medication_id → medications.id

Las relaciones usan "ON DELETE CASCADE": al borrar un medicamento se borran sus horarios, tomas y vínculos con advertencias.

## Definición de endpoints API (sprint 2)

## GET http://localhost:3000
Verifica funcionamiento del servidor.

Respuesta (en formato JSON):
"API funcionando"

## GET http://localhost:3000/users
Obtiene todos los usuarios registrados.
Respuesta (en formato JSON):
[
  {
    "id": "...",
    "name": "Tatiana",
    "email": "49379010@est.ort.edu.ar"
  }
]

## POST http://localhost:3000/users
Crea un nuevo usuario.
Body (JSON):
{
  "name": "Tatiana",
  "email": "49379010@est.ort.edu.ar"
}

## PUT http://localhost:3000/users/:id
Actualiza un usuario existente.
Body (JSON):
{
  "name": "Nuevo nombre",
  "email": "nuevo@email.com"
}

## DELETE http://localhost:3000/users/:id
Elimina un usuario.
Respuesta (en formato JSON):
{
  "message": "Usuario eliminado"
}

## AUTENTICACIÓN

## POST http://localhost:3000/auth/register
Registra un usuario mediante autenticación de Supabase.
Body (JSON):
{
  "email": "user@gmail.com",
  "password": "12345678"
}

## POST http://localhost:3000/auth/login
Inicia sesión.
Body (JSON):
{
  "email": "user@gmail.com",
  "password": "12345678"
}
Respuesta (en formato JSON):
{
  "user": {
    "id": "...",
    "email": "user@gmail.com"
  }
}

## MEDICATIONS

## GET http://localhost:3000/medications
Obtiene todos los medicamentos registrados.
Respuesta (en formato JSON):
[
  {
    "id": "...",
    "name": "Ibuprofeno"
  }
]

## POST http://localhost:3000/medications
Registra un medicamento.
Body (JSON):
{
  "user_id": "...",
  "name": "Ibuprofeno",
  "dosage": "600mg",
  "description": "Dolor muscular"
}

## PUT http://localhost:3000/medications/:id
Edita información de un medicamento.
Body (JSON):
{
  "name": "Paracetamol",
  "dosage": "500mg",
  "description": "Fiebre",
  "frequency": "Cada 8 horas"
}

## DELETE http://localhost:3000/medications/:id
Elimina un medicamento.
Respuesta (en formato JSON):
{
  "message": "Medicamento eliminado"
}

## HORARIOS

## GET http://localhost:3000/schedules
Obtiene todos los horarios configurados.

## POST http://localhost:3000/schedules
Guarda un horario para un medicamento.
Body (JSON):
{
  "medication_id": "...",
  "hour": "08:00"
}
Error: 403 si el medicamento no es del usuario.

## PUT http://localhost:3000/schedules/:id
Cambia la hora de un horario.
Body (JSON):
{ "hour": "09:30" }
Formato válido: "HH:MM".
Errores: 400 (hora inválida), 404 (horario inexistente), 403 (no es del usuario).

## RECORDATORIOS

## GET /reminders/today
Devuelve las tomas programadas **para hoy** con su estado, calculado cruzando los horarios con las tomas registradas.
Respuesta (200):
Body (JSON):
[
  {
    "medication_id": "...",
    "name": "Ibuprofeno",
    "dosage": "400 mg",
    "schedule_id": "...",
    "hour": "08:00",
    "scheduled_for": "2026-10-15T11:00:00.000Z",
    "status": "pending"
  }
]

Valores de `status`:

| Estado    | Significado
| `pending` | Todavía no llegó la hora
| `due`     | Es la hora (dentro de los 60 minutos de tolerancia)
| `taken`   | Ya se registró la toma
| `missed`  | Pasaron más de 60 minutos sin registrarla
La respuesta viene ordenada cronológicamente. Se usa la zona horaria de Argentina (UTC-3).

## TOMAS

## GET http://localhost:3000/intakes
Devuelve historial completo de tomas.

## GET http://localhost:3000/intakes/medication/:id
Obtiene historial filtrado por medicamento.

## POST http://localhost:3000/intakes
Registra una toma.
Body (JSON):
{
  "medication_id": "...",
  "schedule_id": "...",
  "taken": true
}
- schedule_id es opcional.
- taken es true por defecto.
- taken_at lo asigna el servidor.

Respuesta (201):
JSON:
[
  {
    "id": "...",
    "medication_id": "...",
    "schedule_id": "...",
    "taken": true,
    "taken_at": "2026-10-15T11:02:10.000Z"
  }
]

Validaciones:
- 403: el medicamento no es del usuario.
- 400: el horario no corresponde a ese medicamento.
- 409: esa toma ya fue registrada hoy.

## AUTENTICACIÓN
Agregué el archivo authMiddleware para que tenga que estar sí o sí logueado el usuario para, por ejemplo, eliminar un medicamento.

## Advertencias con IA (Gemini)

## POST http://localhost:3000/warnings/sync
Analiza con Gemini los medicamentos activos del usuario y guarda las advertencias (interacciones, duplicados, precauciones).

Funcionamiento:
1. Lee los medicamentos activos y sus horarios.
2. Los envía a Gemini con un esquema de respuesta JSON estructurado.
3. **Recién cuando Gemini responde correctamente**, reemplaza las advertencias anteriores del usuario.
4. Guarda las nuevas y las vincula con los medicamentos (se descartan IDs que no existan).

Respuesta (200):
```JSON:
{
  "message": "Advertencias sincronizadas correctamente.",
  "data": {
    "medications_analyzed": ["..."],
    "warnings": [
      {
        "type": "interaction",
        "severity": "importante",
        "title": "Aspirina + Ibuprofeno",
        "medication_ids": ["...", "..."],
        "message": "...",
        "recommendation": "...",
        "evidence_level": "alto",
        "source": "..."
      }
    ]
  }
}

Respuesta (503) si Gemini está saturado:
```JSON:
{
  "error": "El servicio de análisis está temporalmente ocupado.",
  "message": "Las advertencias anteriores se conservaron. Intentá sincronizar nuevamente más tarde."
}

Tolerancia a fallos:
- Reintenta hasta 3 veces con espera creciente (1 s, 2 s, 4 s) ante errores temporales (429, 500, 502, 503, 504).
- Si hay un modelo de respaldo (`GEMINI_FALLBACK_MODEL`), lo prueba cuando el principal falla.
- Si todo falla, no borra las advertencias que ya existían.

## GET http://localhost:3000/warnings
Devuelve los medicamentos activos del usuario con sus advertencias anidadas.

Respuesta (200):
JSON
{
  "medications": [
    {
      "id": "...",
      "name": "Aspirina",
      "warning_medications": [
        {
          "warnings": {
            "id": "...",
            "type": "interaction",
            "severity": "importante",
            "title": "Aspirina + Ibuprofeno",
            "message": "...",
            "recommendation": "...",
            "evidence_level": "alto",
            "source": "..."
          }
        }
      ]
    }
  ]
}