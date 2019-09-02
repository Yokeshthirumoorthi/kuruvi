FROM node:12-alpine as base

FROM base as builder

ARG EXIF_API_PORT

# Create app directory
WORKDIR /srv

# Install app dependencies
COPY package*.json ./

RUN npm install --only=production

FROM base

WORKDIR /srv

COPY --from=builder /srv/node_modules ./node_modules

# Bundle app source
COPY . .

EXPOSE $EXIF_API_PORT

CMD [ "node", "index.js" ]
