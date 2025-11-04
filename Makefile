Dev:
	docker compose up

Stop-Dev:
	docker compose -f docker-compose.yml down

Prod:
	docker compose -f docker-compose-prod.yml up --build -d

Stop-Prod:
	docker compose -f docker-compose-prod.yml down

Log-Prod:
	docker compose -f docker-compose-prod.yml logs -f