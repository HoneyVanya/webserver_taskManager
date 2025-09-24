
FROM nginx:stable-alpine

RUN rm /usr/share/nginx/html/index.html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY ./frontend /usr/share/nginx/html