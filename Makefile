DOCKER_COMPOSE_DIR = deploy/docker-compose
DOCKER_COMPOSE_FILE = docker-compose.faces.yml

DOCKER_COMPOSE = $(DOCKER_COMPOSE_DIR)/$(DOCKER_COMPOSE_FILE)

IMGPROXYSERVICE = imgproxyservice
SERVICEX = servicex
FACE_API_SERVICE = face-api
EXIF_API_SERVICE = exif-api
FACE_DETECT_SERVICE = face-detect
FACE_CROP_SERVICE = face-crop

FACES = $(FACE_API_SERVICE) $(FACE_DETECT_SERVICE) $(FACE_CROP_SERVICE)

.PHONY: all protogen dotenvgen deploy clean docker-clean

all: protogen dotenvgen deploy
prepare: protogen dotenvgen faces
reset: down deploy

protogen:
	@echo "Copying protofile into services"
	mkdir -p ./src/serviceX/proto
	cp ./pb/kuruvi.proto ./src/serviceX/proto
	mkdir -p ./src/storage/static-generator/proto
	cp ./pb/kuruvi.proto ./src/storage/static-generator/proto
	mkdir -p ./src/storage/photo-upload-server/proto
	cp ./pb/kuruvi.proto ./src/storage/photo-upload-server/proto
	mkdir -p ./src/exif/exif-core/proto
	cp ./pb/kuruvi.proto ./src/exif/exif-core/proto
	mkdir -p ./src/exif/exif-api/proto
	cp ./pb/kuruvi.proto ./src/exif/exif-api/proto

faces:
	for f in $(FACES); do	  \
		mkdir ./src/faces/$$f/proto;	\
		cp ./pb/kuruvi.proto ./src/faces/$$f/proto; \
		cp -f .env ./src/faces/$$f; \
	done

dotenvgen:
	@echo "Copying dotenv into services"
	cp -f .env.sample .env
	cp -f .env ./src/serviceX
	cp -f .env ./src/storage/static-generator
	cp -f .env ./src/storage/photo-upload-server
	cp -f .env ./src/exif/exif-core 
	cp -f .env ./src/exif/exif-api 

deploy:
	@echo "Deploy kuruvi app..."
	docker-compose -f $(DOCKER_COMPOSE) up -d --build

down:
	@echo "Running dockercompose down"
	docker-compose -f $(DOCKER_COMPOSE) down -v

rebuild-$(IMGPROXYSERVICE):
	docker-compose -f $(DOCKER_COMPOSE) up -d --build --no-deps --force-recreate $(IMGPROXYSERVICE)

rebuild-$(SERVICEX):
	docker-compose -f $(DOCKER_COMPOSE) up -d --build --no-deps --force-recreate $(SERVICEX)

rebuild-$(FACE_API_SERVICE):
	docker-compose -f $(DOCKER_COMPOSE) up -d --build --no-deps --force-recreate $(FACE_API_SERVICE)

rebuild-$(FACE_DETECT_SERVICE):
	docker-compose -f $(DOCKER_COMPOSE) up -d --build --no-deps --force-recreate $(FACE_DETECT_SERVICE)

rebuild-$(EXIF_API_SERVICE):
	docker-compose -f $(DOCKER_COMPOSE) up -d --build --no-deps --force-recreate $(EXIF_API_SERVICE)

rebuild-$(FACE_CROP_SERVICE):
	docker-compose -f $(DOCKER_COMPOSE) up -d --build --no-deps --force-recreate $(FACE_CROP_SERVICE)


clean:
	@echo "Removing protofile..."
	rm ./src/serviceX/proto/*.proto
	rmdir ./src/serviceX/proto
# TODO: do the cleaning in all folders

docker-clean:
	./scripts/docker-cleanup.sh