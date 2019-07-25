FROM rustlang/rust:nightly

RUN cargo install diesel_cli --no-default-features --features postgres

WORKDIR /usr/src/app

COPY . .

CMD ["diesel", "setup"]
