FROM node:18.17
RUN mkdir /app && \
    chown node:node /app
WORKDIR /app
USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm install --no-audit --progress=false
COPY --chown=node:node . .
RUN npm run build --production
EXPOSE 3000
STOPSIGNAL SIGINT
ENV HOST=0.0.0.0
ENV BASE_URL=/fix/
CMD ["npm", "run", "start"]
