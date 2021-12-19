FROM ubuntu
RUN apt-get -y update
RUN apt-get -y install curl
RUN apt-get -y install git
RUN apt-get -y install bash
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get -y install nodejs
WORKDIR /
COPY . .
EXPOSE 8010
RUN npm install --save-dev hardhat || exit 0
RUN npm install || exit 0
CMD ./Commands.sh