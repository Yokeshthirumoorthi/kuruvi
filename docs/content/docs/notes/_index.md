---
title: 'Notes'
date: 2019-09-21T19:27:37+10:00
draft: false
summary: Project notes - todos, links.
---

<!-- 
DISCLAIMER: Simple notes, todos, best practises or my opinions and thoughts, 
about the project, are saved in this document just for my own reference. So DONT 
give any serious considerations for these points.
-->

* Need to have a testing loop
    * Add fixtures data
    * Add a loadgenerator service
* What are the various measures and benchmarking
    * Add log inside all the functions
    * Add Kafka and spark/hadoop service to save those logs
* How to monitor the service    
    * Add monitoring service with prometheus and graphana 
    * Add kubernetus and isitio
* How to work with each service with minimal dependecy
    * Add docker compose and development work flow process for each service
* How to make others comfortble to add contributions
    * Add proper readme for each services
    * Always stick to 12 app factors

* Links
- (RisingStack/example-prometheus-nodejs)[https://github.com/RisingStack/example-prometheus-nodejs]
- (openzipkin/zipkin-js)[https://github.com/openzipkin/zipkin-js]
- (jeremyeder/docker-performance)[https://github.com/jeremyeder/docker-performance]
- (Monitoring Performance in Microservice Architectures)[https://blog.container-solutions.com/monitoring-performance-microservice-architectures]
- (Monitoring Microservices with Prometheus)[https://blog.container-solutions.com/microservice-monitoring-with-prometheus]