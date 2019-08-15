.PHONY: all protogen dotenvgen deploy clean

all: protogen dotenvgen deploy
prepare: protogen dotenvgen

protogen:
	@echo "Copying protofile into services"
	mkdir -p ./src/serviceX/proto
	cp ./pb/kuruvi.proto ./src/serviceX/proto
	mkdir -p ./src/storage/static-generator/proto
	cp ./pb/kuruvi.proto ./src/storage/static-generator/proto


dotenvgen:
	@echo "Copying dotenv into services"
	cp .env.sample .env
	cp .env ./src/serviceX
	cp .env ./src/storage/static-generator

deploy:
	@echo "Deploy kuruvi app..."
	docker-compose -f deploy/docker-compose/docker-compose.yml up -d --build

clean:
	@echo "Removing protofile..."
	rm ./src/serviceX/proto/*.proto
	rmdir ./src/serviceX/proto
