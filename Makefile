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

#------------------------------

generate-ssl:
	mkdir -p nginx/certs && cd nginx/certs && openssl genrsa -out server.key 2048 && openssl req -new -x509 -key server.key -out server.crt -days 365 -subj "/C=BR/ST=DF/L=Brasilia/O=MKJS/OU=Dev/CN=localhost"
