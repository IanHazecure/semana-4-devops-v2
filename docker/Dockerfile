server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Se genera al iniciar el contenedor a partir de APP_ENV y APP_VERSION
    location = /config.json {
        add_header Cache-Control "no-store";
        try_files $uri =404;
    }

    # Archivos de Vite con hash en el nombre: se pueden cachear
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # Rutas de la SPA: si no existe el archivo, se entrega index.html
    location / {
        add_header Cache-Control "no-cache";
        try_files $uri $uri/ /index.html;
    }
}
