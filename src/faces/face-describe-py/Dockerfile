FROM python:2.7-slim
RUN apt-get update -qqy && \
	apt-get -qqy install wget g++ && \
	rm -rf /var/lib/apt/lists/*

ARG FACE_DESCRIBE_PORT
# show python logs as they occur
ENV PYTHONUNBUFFERED=0

# download the grpc health probe
# RUN GRPC_HEALTH_PROBE_VERSION=v0.2.0 && \
#     wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
#     chmod +x /bin/grpc_health_probe

# get packages
WORKDIR /srv
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# add files into working directory
COPY . .

# set listen port
ENV PORT $FACE_DESCRIBE_PORT
EXPOSE $FACE_DESCRIBE_PORT

CMD ["python", "/srv/server.py"]
