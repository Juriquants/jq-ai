.PHONY: build run stop clean

build:
	docker build -t jq-proxy .

run:
	docker run -d --name jq-proxy -p 80:80 jq-proxy

stop:
	docker stop jq-proxy

clean:
	docker rm jq-proxy
