FROM node:10
WORKDIR /var/www/app
COPY dist/ dist/
COPY .env /var/www/app
COPY package.json /var/www/app
RUN npm install
