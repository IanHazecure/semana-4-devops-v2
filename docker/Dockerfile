# ---------- Etapa 1: compilar la app de React con Vite ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build

# ---------- Etapa 2: servir los archivos estáticos con Nginx ----------
FROM nginx:stable-alpine

# Valores por defecto. En el despliegue se sobrescriben con: docker run -e APP_ENV=... -e APP_VERSION=...
# Al iniciar, Nginx genera /usr/share/nginx/html/config.json desde la plantilla.
ENV APP_ENV=local \
    APP_VERSION=dev \
    NGINX_ENVSUBST_OUTPUT_DIR=/usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf
COPY config.json.template /etc/nginx/templates/config.json.template
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
