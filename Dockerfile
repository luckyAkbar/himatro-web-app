FROM node:14.17.5
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "start"]