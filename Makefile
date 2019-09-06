DOCKER_COMPOSE_DIR = deploy/docker-compose
DOCKER_COMPOSE_FILE = docker-compose.py.yml

DOCKER_COMPOSE = $(DOCKER_COMPOSE_DIR)/$(DOCKER_COMPOSE_FILE)

PHOTO_UPLOAD_SERVER = photo-upload-server
STATIC_GENERATOR = static-generator
STORAGE_API=storage-api
IMGPROXYSERVICE = imgproxyservice
SERVICEX = servicex
FACE_API_SERVICE = face-api
EXIF_API_SERVICE = exif-api
EXIF_CORE_SERVICE = exif-core
FACE_DETECT_SERVICE = face-detect
FACE_DESCRIBE_SERVICE = face-describe
FACE_DESCRIBE_SERVICE_PY = face-describe-py
FACE_CROP_SERVICE = face-crop
RESIZE_API_SERVICE = resize-api
RESIZE_CORE_SERVICE = resize-core
PGSQL_API_SERVICE = pgsql-api
PGSQL_CORE_SERVICE = pgsql-core

EXIF = $(EXIF_API_SERVICE) $(EXIF_CORE_SERVICE)
FACES = $(FACE_API_SERVICE) $(FACE_DETECT_SERVICE) $(FACE_DESCRIBE_SERVICE) $(FACE_CROP_SERVICE) $(FACE_DESCRIBE_SERVICE_PY)
STORAGE = $(STATIC_GENERATOR) $(PHOTO_UPLOAD_SERVER) $(STORAGE_API)
RESIZE = $(RESIZE_API_SERVICE) $(RESIZE_CORE_SERVICE)
PGSQL = $(PGSQL_API_SERVICE)

.PHONY: all dotenvgen deploy clean

all: prepare deploy
prepare: dotenvgen protogen exif faces resize storage servicex pgsql
reset: down prepare deploy

################################################################################
# Setup
################################################################################

exif:
	for f in $(EXIF); do	  \
		mkdir -p ./src/exif/$$f/proto;	\
		cp ./pb/kuruvi.proto ./src/exif/$$f/proto; \
		cp -f .env ./src/exif/$$f; \
	done

faces:
	for f in $(FACES); do	  \
		mkdir -p ./src/faces/$$f/proto;	\
		cp ./pb/kuruvi.proto ./src/faces/$$f/proto; \
		cp -f .env ./src/faces/$$f; \
	done

resize:
	for f in $(RESIZE); do \
		mkdir -p ./src/resize/$$f/proto;	\
		cp ./pb/kuruvi.proto ./src/resize/$$f/proto; \
		cp -f .env ./src/resize/$$f; \
	done

storage:
	for f in $(STORAGE); do	  \
		mkdir -p ./src/storage/$$f/proto;	\
		cp ./pb/kuruvi.proto ./src/storage/$$f/proto; \
		cp -f .env ./src/storage/$$f; \
	done

servicex:
	mkdir -p ./src/serviceX/proto
	cp ./pb/kuruvi.proto ./src/serviceX/proto
	cp -f .env ./src/serviceX

pgsql:
	for f in $(PGSQL); do	  \
		mkdir -p ./src/pgsql/$$f/proto;	\
		cp ./pb/kuruvi.proto ./src/pgsql/$$f/proto; \
		cp -f .env ./src/pgsql/$$f; \
	done

protogen:
	python -m grpc_tools.protoc -I./pb --python_out=./src/faces/$(FACE_DESCRIBE_SERVICE_PY) --grpc_python_out=./src/faces/$(FACE_DESCRIBE_SERVICE_PY) ./pb/kuruvi.proto

dotenvgen:
	cp -f .env.sample .env

################################################################################
# Builds
################################################################################
	
deploy:
	@echo "Deploy kuruvi app..."
	docker-compose -f $(DOCKER_COMPOSE) up -d --build

# Ref: https://stackoverflow.com/questions/6273608/how-to-pass-argument-to-makefile-from-command-line/6273809
%:      # thanks to chakrit
	@:    # thanks to William Pursell

up:
	docker-compose -f $(DOCKER_COMPOSE) up -d --build --no-deps --force-recreate $(filter-out $@,$(MAKECMDGOALS))

down:
	docker-compose -f $(DOCKER_COMPOSE) down -v

################################################################################
# Misc
################################################################################

clean:
	# stop all containers
	docker stop $$(docker ps -a -q)
	
	# destroy all containers
	docker rm --force $$(docker ps -a -q)

	# destroy all images
	docker rmi --force $$(docker images -q)

	# destroy all volumes
	docker volume rm $$(docker volume ls -q --filter dangling=true)

	# remove if something is still dangling
	docker system prune

################################################################################
# Code Quality - TODO
################################################################################

################################################################################
# Good Reference
################################################################################

# 1. https://maex.me/2018/02/dont-fear-the-makefile/#phony