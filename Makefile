.PHONY: all protogen dotenvgen deploy clean docker-clean

all: protogen dotenvgen deploy
prepare: protogen dotenvgen

protogen:
	@echo "Copying protofile into services"
	mkdir -p ./src/serviceX/proto
	cp ./pb/kuruvi.proto ./src/serviceX/proto
	mkdir -p ./src/storage/static-generator/proto
	cp ./pb/kuruvi.proto ./src/storage/static-generator/proto
	mkdir -p ./src/storage/photo-upload-server/proto
	cp ./pb/kuruvi.proto ./src/storage/photo-upload-server/proto

dotenvgen:
	@echo "Copying dotenv into services"
	cp -f .env.sample .env
	cp -f .env ./src/serviceX
	cp -f .env ./src/storage/static-generator
	cp -f .env ./src/storage/photo-upload-server

deploy:
	@echo "Deploy kuruvi app..."
	docker-compose -f deploy/docker-compose/docker-compose.db.yml up -d --build

clean:
	@echo "Removing protofile..."
	rm ./src/serviceX/proto/*.proto
	rmdir ./src/serviceX/proto

docker-clean:
	./scripts/docker-cleanup.sh