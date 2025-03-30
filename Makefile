VERSION=0.3.0

all: prebuild frontend wfe

wfe:
	CGO_ENABLED=0 go build -ldflags "-s -w" -o wfe .

prebuild:
	go mod download

frontend:
	templ generate 
	npx tailwindcss -i ./app.css -o ./_static-assets/css/output.css

dockerimage: frontend wfe
	docker build . -t wfe

release:
	git tag -a $(VERSION)
	git push origin $(VERSION)
	goreleaser release --clean

clean:
	rm -rf react-build dist wfe

.PHONY: wfe frontend prebuild clean
