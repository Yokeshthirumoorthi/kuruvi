FROM node:12-alpine

RUN apk --no-cache add python \
                       build-base \
                       python-dev \
                       py-pip \
                       # Pillow depenencies
                       jpeg-dev \
                       zlib-dev \
                       freetype-dev \
                       lcms2-dev \
                       openjpeg-dev \
                       tiff-dev \
                       tk-dev \
                       tcl-dev

# install from pip, without webp
RUN LIBRARY_PATH=/lib:/usr/lib /bin/sh -c "pip install Pillow"

RUN apk --no-cache add git
# RUN git clone https://github.com/python-pillow/Pillow.git /Pillow
# RUN pip install virtualenv && virtualenv /vpy && source /vpy/bin/activate && pip install nose

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

# Bundle app source
COPY . .

RUN git clone git://git.zx2c4.com/PhotoFloat

EXPOSE 8000
CMD [ "node", "index.js" ]
