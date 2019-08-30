FROM node:8 as base

FROM base as builder

ARG FACE_DETECT_PORT

# Create app directory
WORKDIR /srv

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN git clone https://github.com/justadudewhohacks/face-api.js.git && \
    mkdir src && \
    cp -r face-api.js/examples/examples-nodejs/commons ./src && \
    cp -r face-api.js/weights ./ && \
    npm install -g typescript@3.5.2 && \
    npm install

COPY . .    

RUN tsc index.ts

FROM base

WORKDIR /srv

COPY --from=builder /srv ./

EXPOSE $FACE_DETECT_PORT

CMD [ "node", "index.js" ]
