FROM nginx:latest

# Copia la configuración de Nginx al contenedor
COPY default.conf /etc/nginx/conf.d/default.conf

# Copia el contenido de la aplicación web
COPY html/ /usr/share/nginx/html/

EXPOSE 80