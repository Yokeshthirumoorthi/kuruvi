FROM node:12-alpine as base

FROM base as builder

# Create app directory
WORKDIR /srv

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --only=production

FROM base

WORKDIR /srv

COPY --from=builder /srv/node_modules ./node_modules

# Bundle app source
COPY . .

ARG WORKFLOW_PORT
EXPOSE $WORKFLOW_PORT

CMD [ "node", "index.js" ]
