dev-up:
	docker compose up

dev-stop:
	docker compose -f docker-compose.yml down

dev-games:
	docker exec -it mkjs_postgresql psql -U docker -d mkjs -c "SELECT * FROM games;"

dev-players:
	docker exec -it mkjs_postgresql psql -U docker -d mkjs -c "SELECT * FROM players;"

#------------------------------

prod-up:
	docker compose -f docker-compose-prod.yml up --build -d

prod-stop:
	docker compose -f docker-compose-prod.yml down

prod-log:
	docker compose -f docker-compose-prod.yml logs -f

prod-games:
	docker exec -it mkjs_postgresql psql -U docker -d mkjs -c "SELECT * FROM games;"

prod-players:
	docker exec -it mkjs_postgresql psql -U docker -d mkjs -c "SELECT * FROM players;"