FROM node:25

WORKDIR /app

COPY --chown=node:node . .

RUN npm install

ENTRYPOINT ["node", "src/index.js"]
CMD ["--x=44", "--y=77", "--app=snake"]
