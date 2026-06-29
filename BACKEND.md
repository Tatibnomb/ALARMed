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

## DELETE /users/:id
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

## SCHEDULES

## GET http://localhost:3000/schedules
Obtiene todos los horarios configurados.

## POST http://localhost:3000/schedules
Guarda un horario para un medicamento.
Body (JSON):
{
  "medication_id": "...",
  "hour": "08:00"
}

## INTAKES

## GET http://localhost:3000/intakes
Devuelve historial completo de tomas.

## GET http://localhost:3000/intakes/medication/:id
Obtiene historial filtrado por medicamento.

## POST http://localhost:3000/intakes
Registra una toma.
Body (JSON):
{
  "medication_id": "...",
  "taken": true
}

Ejemplo respuesta (en formato JSON):
{
  "taken": true,
  "taken_at": "2025-07-24T18:00:00"
}