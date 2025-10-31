
Build:
	docker build -t mkjs_server_dev -f Dockerfile.dev .

Run:
	docker run --rm -it \
      -p 55555:55555 \
      -v "$PWD":/usr/src/app \
      -v /usr/src/app/node_modules \
      -e "NODE_ENV=development" \
      -e "PORT=55555" \
      mkjs_server_dev
