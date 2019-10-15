FROM golang:1.12-alpine AS builder

RUN apk add --no-cache ca-certificates git && \
      wget -qO/go/bin/dep https://github.com/golang/dep/releases/download/v0.5.0/dep-linux-amd64 && \
      chmod +x /go/bin/dep

ENV PROJECT github.com/yokeshthirumoorthi/kuruvi/src/workflow-go
WORKDIR /go/src/$PROJECT

# restore dependencies
COPY Gopkg.* ./
RUN dep ensure --vendor-only -v

COPY . .
RUN go build -o /workflow-go .

FROM alpine AS release

RUN apk add --no-cache ca-certificates

# RUN GRPC_HEALTH_PROBE_VERSION=v0.2.0 && \
#     wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
#     chmod +x /bin/grpc_health_probe

WORKDIR /workflow-go
COPY --from=builder /workflow-go ./server

EXPOSE 1515
ENTRYPOINT ["/workflow-go/main"]