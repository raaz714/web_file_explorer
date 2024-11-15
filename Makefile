VERSION=0.2.0

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

release:
	git tag -a $(VERSION)
	git push origin $(VERSION)
	goreleaser release --clean

clean:
	rm -rf react-build dist wfe

.PHONY: frontend prebuild clean
