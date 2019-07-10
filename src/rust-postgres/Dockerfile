# FROM clux/muslrust:stable as builder
FROM rustlang/rust:nightly

RUN cargo install diesel_cli --no-default-features --features postgres

WORKDIR /usr/src/app

COPY . .

EXPOSE 3001

CMD [ "cargo", "run" ]
# RUN mkdir -p /out && cp /root/.cargo/bin/diesel /out/

# FROM alpine:latest
# COPY --from=builder /out/diesel /bin/

# RUN apk add --no-cache ca-certificates

# CMD diesel

# docker run -it clux/diesel-cli diesel migration run
