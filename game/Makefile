Build-Dev:
	docker build -t mkjs_client_dev -f Dockerfile.dev .

# --init para parar no ctrl c
Run-Dev:
	docker run --rm -it --init -p 8080:8080 -v "$(PWD)":/usr/src/app/game mkjs_client_dev

Build-Prod:
	docker build -t mkjs_client_prod -f Dockerfile.prod .

Run-Prod:
	docker run --rm -it -p 8080:80 mkjs_client_prod
