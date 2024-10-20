FROM alpine:3.14

WORKDIR /app

COPY ./wfe /app

ENTRYPOINT ["./wfe"]
