Preparación para desplegar backend-academy-file a Google Cloud (Cloud Run)

Resumen

Este servicio expone API HTTP para gestionar archivos (upload/download/list). Este README explica cómo construir la imagen Docker, subirla a Container Registry y desplegar en Cloud Run usando Cloud Build.

Archivos añadidos
- Dockerfile.prod        # multi-stage build (deps, build, prod)
- .dockerignore          # para excluir node_modules, dist, .env, uploads, etc.
- cloudbuild.yaml        # build + push + deploy to Cloud Run (uses substitutions)

Requisitos previos
- gcloud instalado y autenticado (gcloud auth login)
- Proyecto GCP activo: gcloud config set project PROJECT_ID
- Habilitar APIs: Cloud Run, Cloud Build, Container Registry (o Artifact Registry)
  gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com

Instrucciones rápidas

1) Build & push local (Docker):
   cd academy/backend-academy-file
   docker build -f Dockerfile.prod -t gcr.io/PROJECT_ID/backend-academy-file:latest .
   docker push gcr.io/PROJECT_ID/backend-academy-file:latest

2) Deploy con gcloud (Cloud Run):
   gcloud run deploy backend-academy-file \
     --image gcr.io/PROJECT_ID/backend-academy-file:latest \
     --region REGION \
     --platform managed \
     --allow-unauthenticated \
     --set-env-vars PORT=3004,HOST=DB_HOST,PORT_DB=5432,USERNAME=DB_USER,PASSWORD=DB_PASS,DATABASE=DB_NAME

   Ajusta las env vars según tu base de datos o entorno.

3) Deploy con Cloud Build (ci):
   cd academy/backend-academy-file
   gcloud builds submit --config cloudbuild.yaml --substitutions=_REGION=REGION,_SERVICE_NAME=backend-academy-file

Notas importantes

- Persistencia de archivos: Cloud Run tiene filesystem efímero. Los archivos escritos en /tmp o en el contenedor no persisten entre instancias.
  - Recomendado: usar Google Cloud Storage para almacenar archivos de forma persistente.
  - Alternativa (no recomendada en Cloud Run): montar un volumen en GKE o usar Filestore.

- Base de datos: Recomendado usar Cloud SQL (Postgres). Para Cloud Run hay dos opciones:
  - Conector de Cloud SQL: desplegar con `--add-cloudsql-instances` y configurar la variable CLOUD_SQL_CONNECTION_NAME, y en la app usar socket path `/cloudsql/INSTANCE_CONNECTION_NAME`.
  - Exponer DB con IP pública y restringir el acceso por redes autorizadas (menos seguro).

- Variables de entorno:
  - HOST / PORT_DB / USERNAME / PASSWORD / DATABASE para la conexión a Postgres
  - NODE_ENV=production
  - PORT (3004 por defecto)

- Si planeas usar el Gateway: actualiza en el Gateway las env vars FILES_SERVICE_URL o los endpoints para que apunten a la URL de Cloud Run (ej: https://backend-academy-file-xxxxx.a.run.app).

Siguientes pasos recomendados

- Implementar almacenamiento en Cloud Storage en lugar de filesystem local.
- Añadir healthcheck/endpoint /health y configurar readiness probe en Cloud Run.
- Revisar permisos/roles de la cuenta de servicio que ejecuta Cloud Run (acceso a Cloud SQL, Cloud Storage).

Si quieres, puedo:
- Añadir código para subir directamente a Cloud Storage y eliminar dependencia en filesystem local.
- Preparar una plantilla de `gcloud run deploy` con todas las env vars necesarias y la configuración de Cloud SQL connector.

