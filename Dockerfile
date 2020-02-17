FROM node:10-alpine
RUN apk update && apk add tzdata python make gcc g++ git \
&& ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
&& echo "Asia/Shanghai" > /etc/timezone \
&& rm -rf /var/cache/apk/*
WORKDIR /src
COPY . .
RUN npm install
CMD ["npm","run","start"]