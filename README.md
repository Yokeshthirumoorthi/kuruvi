# kuruvi
Copyright (c) 2019 Yokesh Thirumoorthi
WIP.

Kuruvi: a smart photo collection and management application.

Kuruvi can be used to provide a fast and secure way to replace all the image resizing code of your web application (like calling ImageMagick or GraphicsMagick, or using libraries), while also being able to resize everything on the fly, fast and easy. Kuruvi is also indispensable when handling lots of image resizing, especially when images come from a remote source.

## Build and Run Instructions

```
git clone https://github.com/Yokeshthirumoorthi/kuruvi
cd kuruvi
docker-compose up
```
## Service Architecture

**Kuruvi App** is composed of many microservices written in different
languages that talk to each other over gRPC.
Each microservice in Kuruvi does one thing and does it well.
Kuruvi is a mostly a Node based application, completly containerized and ready to be installed and used in any Os, using Docker.


[![Architecture of
microservices](./docs/img/architecture-diagram.png)](./docs/img/architecture-diagram.png)

| Service                                              | Language      | Description                                                                                                                       |
| ---------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [web server](./express)                           | Node.js            | Exposes a rest endpoint for image uploading.  |
| [exif service](./node-exif)                       | Node.js            | Extracts and stores exif metadata in database.  |
| [image resize service](./node-imgproxy)           | Node.js            | Resize images fast and easy.  |
| [face api service](./faceapi)                     | Node.js            | Do image recognition  |
| [db adapter service](./database)                     | Node.js            | Interface for database  |
| [fs adapter service](./filesystem)                     | Node.js            | Interface for filesystem|
| [static web server](./static-site)                     | Node.js            | serve static files|

<!-- Find **Protocol Buffers Descriptions** at the [`./pb` directory](./pb). -->

## Features

* Detect and compare human faces
* Organize images into groups based on similarities
* Identify previously tagged people in images
* Extract exif metadata from the images
* Fast and secure resizing
* Organize with albums
* Browse by date
* Geolocate the photos on a map
* Privacy on photos
* Share and tag photos with friends

## Development Principles

The main principles of kuruvi are simplicity, scalability, speed, and security.

- **[The Twelve-Factor App](https://12factor.net/)**
- **[The Principles of Microservices (by Sam Newman)](https://learning.oreilly.com/videos/the-principles-of/9781491935811)**
- **[GCP Microservices demo development principles](https://github.com/GoogleCloudPlatform/microservices-demo/blob/master/docs/development-principles.md)**


## TODO
* Benchmark the performance.

## Authur

1. Yokesh Thirumoorthi - initial author - yokeshthirumoorthi@gmail.com

## Sending Feedback

I am always open to [your feedback](https://github.com/Yokeshthirumoorthi/kuruvi/issues).

## Credits
This application uses Open Source components. You can find the source code of their open source projects along with license information below. I acknowledge and am grateful to these developers for their contributions to open source.

```
- **[Imgproxy](https://github.com/imgproxy/imgproxy)**
- **[Face Api-js](https://github.com/justadudewhohacks/face-api.js?files=1)**
- **[Node exif](https://github.com/gomfunkel/node-exif)**
<!-- Sample Photos: https://github.com/ianare/exif-samples.git -->
```

## License

This program is licensed under the "MIT License". Please see the file LICENSE in the source distribution of this software for license terms.
