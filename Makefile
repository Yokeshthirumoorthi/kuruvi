.PHONY: all protogen dotenvgen deploy clean

all: protogen dotenvgen deploy
prepare: protogen dotenvgen

protogen:
	@echo "Copying protofile into services"
	mkdir ./src/serviceX/proto
	cp ./pb/kuruvi.proto ./src/serviceX/proto

dotenvgen:
	@echo "Copying dotenv into services"
	mv .env.sample .env
	cp .env ./src/serviceX

deploy:
	@echo "Deploy kuruvi app..."
	docker-compose -f deploy/docker-compose/docker-compose.yml up -d --build

clean:
	@echo "Removing protofile..."
	rm ./src/serviceX/proto/*.proto
	rmdir ./src/serviceX/proto
