.PHONY: all protogen dotenvgen deploy clean docker-clean

all: protogen dotenvgen deploy
prepare: protogen dotenvgen faces

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
	@echo "Preparing Faces services"
	mkdir -p ./src/faces/face-api/proto
	cp ./pb/kuruvi.proto ./src/faces/face-api/proto

	@echo "Copy env for Faces services"
	cp -f .env ./src/faces/face-api

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
	docker-compose -f deploy/docker-compose/docker-compose.faces.yml up -d --build

clean:
	@echo "Removing protofile..."
	rm ./src/serviceX/proto/*.proto
	rmdir ./src/serviceX/proto
# TODO: do the cleaning in all folders

docker-clean:
	./scripts/docker-cleanup.sh