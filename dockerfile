#Primera etapa: instalación y compilación
FROM node:8.6 as builder
WORKDIR  /app
COPY ./ /app/
RUN npm install
RUN npm run build

#Segunda etapa: despliegue.
FROM nginx:1.13
COPY --from=builder /app/dist/ /usr/share/nginx/html
COPY ./nginx-config.conf /etc/nginx/conf.d/default.conf
