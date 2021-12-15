FROM ubuntu
WORKDIR /app
RUN apt-get -y update 
RUN apt-get -y upgrade
RUN apt-get -y install nodejs
RUN apt-get install npm
COPY package-lock.json /app/
COPY package.json /app/
RUN npm install
EXPOSE 8010
COPY .env /app/
COPY Commands.sh /app/
COPY src/. /app/
CMD ./Commands.sh

