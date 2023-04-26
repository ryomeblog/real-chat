# backend/Dockerfile
FROM node:16-buster

WORKDIR /app

COPY . .
RUN echo "fetch-retries=5" >> .npmrc && \
    echo "fetch-retry-factor=3" >> .npmrc && \
    echo "fetch-retry-mintimeout=60000" >> .npmrc && \
    echo "fetch-retry-maxtimeout=300000" >> .npmrc && \
    npm i --legacy-peer-deps

EXPOSE 13001

CMD ["npm", "start"]
