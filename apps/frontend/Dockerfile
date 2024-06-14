FROM node:alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app/frontend
COPY . .
RUN chown -R node:node /app/frontend/
USER node
RUN npm install --verbose
RUN npm run build
RUN chmod -R 777 /app/frontend/node_modules

EXPOSE 5173
CMD [ "npm", "run", "preview" ]