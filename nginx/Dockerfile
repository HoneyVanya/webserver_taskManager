# Start with the official, stable NGINX image.
FROM nginx:stable-alpine

# Remove the default, "Welcome to nginx!" page.
RUN rm /usr/share/nginx/html/index.html

# Copy our custom, production-ready NGINX configuration file.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# This is the key step:
# This Dockerfile expects a 'frontend' directory to exist in its build context.
# We will copy the contents of that 'frontend' directory to the location NGINX serves from.
COPY ./frontend /usr/share/nginx/html