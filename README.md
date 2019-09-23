# kuruvi
Copyright © 2019 Yokesh Thirumoorthi

**WIP. Not ready for production !!!**

**Kuruvi** is a smart photo management app.


When users upload a photo album, this app processes the photos in the album and gets them resized, organized by date, time and location, detect faces and recognize faces. The processed album is then statically serverd back to users via web.


## Build and Deploy Instructions
  - Using [Docker Compose](./docs/content/docs/docker-compose/index.md)
  - Using [Kubernetes](./docs/content/docs/kubernetes/index.md)

## Service Architecture

This project is developed as multi-tier microservices application. Yet each microservice in this app ensures to **Do one thing and do it well**.

All services in Kuruvi is developed using Nodejs (Services will be refactored to Golong in future), and containerized using Docker.

<!-- 
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
 -->
<!-- Find **Protocol Buffers Descriptions** at the [`./pb` directory](./pb). -->

## Features

* Store photo albums securely in cloud
* Organize photos based on time, date and location
* Detect and recognize faces
* Resize photos

## Nice to have features

* Detect and compare faces
* Geolocate the photos on a map
* Share and tag photos with friends
* Identify previously tagged people in images

## Development Principles

The main principles of kuruvi app are Simplicity, Scalability, Speed, and Security.

- **[The Twelve-Factor App](https://12factor.net/)**
- **[The Principles of Microservices (by Sam Newman)](https://learning.oreilly.com/videos/the-principles-of/9781491935811)**
- **[GCP Microservices demo development principles](https://github.com/GoogleCloudPlatform/microservices-demo/blob/master/docs/development-principles.md)**

<!-- 
## Measurements And Beanchmarks

### Profiling & Metrics - Done using Prometheus and Graphana

To deploy Prometheus & Grafana and to setup all the nice graphs that we got ready for you, simply:

```
docker-compose -f ./deploy/docker-compose/docker-compose.monitoring.yml up -d
```
Wait for the deployment to be ready. Check the status with

```
docker-compose -f ./deploy/docker-compose/docker-compose.monitoring.yml ps
```

Importing The Dashboards
You only need to do this once:

```
  docker-compose \
    -f ./deploy/docker-compose/docker-compose.monitoring.yml \
    run \
    --entrypoint /opt/grafana-import-dashboards/import.sh \
    --rm \
    importer
```

**Accessing The Services**

Once the services are up & running you can access them with the following URLs:

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000

**Grafana Credentials**

   | Username |	Password |
   | -------- | -------- |
   | admin	| foobar |

* Tracing - Done with zipkin

### Logging - Done using Elasticsearch, Logstash and Kibana (ELK stack)

If you want to run the application using a more advanced logging setup based on Fluentd + ELK stack, you can add the logging compose file to override some settings and add some extra containers:

```
docker-compose -f deploy/docker-compose/docker-compose.yml -f deploy/docker-compose/docker-compose.logging.yml up -d
```

Once deployed, you should be able to reach Kibana on http://localhost:5601. -->

## Authur

1. Yokesh Thirumoorthi - initial author - yokeshthirumoorthi@gmail.com

## Sending Feedback

I am always open to [your feedback](https://github.com/Yokeshthirumoorthi/kuruvi/issues).

## Credits
This application uses Open Source components. You can find the source code of their open source projects along with license information below. I acknowledge and am grateful to these developers for their contributions to open source.

- **[GCP/Microservices Demo](https://github.com/GoogleCloudPlatform/microservices-demo)**
- **[Weaveworks/Microservices Demo](https://microservices-demo.github.io/)**
- **[Imgproxy](https://github.com/imgproxy/imgproxy)**
- **[Face Api-js](https://github.com/justadudewhohacks/face-api.js?files=1)**
- **[Node exif](https://github.com/gomfunkel/node-exif)**
<!-- Sample Photos: https://github.com/ianare/exif-samples.git -->

## License

This program is licensed under the "MIT License". Please see the file LICENSE in the source distribution of this software for license terms.
