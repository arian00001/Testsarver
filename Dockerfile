FROM node:20-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8787
CMD ["npm", "start"]
