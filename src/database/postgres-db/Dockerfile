FROM postgres:9

ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=kuruvidb


COPY ./data/dump.sql /docker-entrypoint-initdb.d/