
all: frontend wfe

wfe:
	CGO_ENABLED=0 go build -ldflags "-s -w" -o wfe .

prebuild:
	go mod download
	cd frontend && npm i

frontend:
	cd frontend && npm run build

dockerimage: frontend wfe
	docker build . -t wfe

clean:
	rm -rf dist wfe

.PHONY: frontend prebuild clean
