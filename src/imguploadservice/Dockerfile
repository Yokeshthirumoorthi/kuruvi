FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN git clone git://git.zx2c4.com/PhotoFloat

RUN apt-get update && \
    apt-get install -y build-essential && \
    apt-get install -y curl && \
    DEBIAN_FRONTEND=noninteractive && \
    # Install Git
    apt-get install -y git && \
    # Install pyton
    apt-get install -y python && \
    apt-get install -y python-pip && \
    pip install Pillow

EXPOSE 8000
# CMD [ "node", "index.js" ]
CMD [ "node", "server.js" ]
