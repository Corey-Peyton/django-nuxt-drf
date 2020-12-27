# yarn dev

FROM node:10.23.0

# make the 'app' folder the current working directory
WORKDIR /app/

# USER node


# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# expose port 3000 to the host
EXPOSE 3000

CMD ["sh", "start_dev.sh"]