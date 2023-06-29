# node:lts-alpine uses node version 18.16.0
FROM node:lts-alpine

WORKDIR /usr/local/web-app-service

# copy all files into the image
COPY . ./

# install packages
RUN npm install

# give start.sh script execution rights
RUN chmod u+x start.sh

EXPOSE 8080

CMD [ "./start.sh" ]
