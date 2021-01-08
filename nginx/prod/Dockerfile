# ci stage
FROM nginx:1.13.12-alpine as production
COPY prod/prod.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
