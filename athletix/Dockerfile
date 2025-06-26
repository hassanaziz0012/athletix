FROM node:20.17.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG NEXT_PUBLIC_BACKEND_PORT=3002

ENV NEXT_PUBLIC_BACKEND_PORT=${NEXT_PUBLIC_BACKEND_PORT}

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
