package services

import (
	// "fmt"
	"context"
	"log"
	// "os"
	"time"
	// "encoding/json"
	"google.golang.org/grpc"
	// pb "google.golang.org/grpc/examples/helloworld/helloworld"
	pb "github.com/yokeshthirumoorthi/workflow-go/pb"
	utils "github.com/yokeshthirumoorthi/workflow-go/utils"
)

const (
	address = "192.168.1.100:8003"
)

// Exif is a function to extract meta data from photos
func Exif(message utils.Message) *pb.ExifData {
	// Set up a connection to the server.
	conn, err := grpc.Dial(address, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewExifCoreClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	url := utils.GetURL(message).Upload

	exifData, err := c.ExtractExif(ctx, &pb.PhotoURL{Url: url})

	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}

	return exifData
}


