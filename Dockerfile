FROM ubuntu
WORKDIR /app
RUN apt-get -y update 
RUN apt-get -y upgrade
RUN apt-get update
RUN apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN apt-get -y install nodejs
RUN apt -y  install gcc g++ make
COPY package-lock.json /app/
COPY package.json /app/
RUN npm install
EXPOSE 8010
COPY .env /app/
COPY Commands.sh /app/
COPY src/. /app/
CMD ./Commands.sh

