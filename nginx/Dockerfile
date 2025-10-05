FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY frontend-dist /usr/share/nginx/html/frontend