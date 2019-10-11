install:
	docker volume create nodemodules
	docker-compose -f docker-compose.builder.yml run --rm install
up:
	docker-compose up
down:
	docker-compose down
