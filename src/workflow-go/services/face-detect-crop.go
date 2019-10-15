
package services

import (
	"fmt"
	"context"
	"log"
	"os"
	"time"
    "io"
    "net/http"
	"google.golang.org/grpc"
	pb "github.com/yokeshthirumoorthi/workflow-go/pb"
	utils "github.com/yokeshthirumoorthi/workflow-go/utils"
)

const (
	faceDetectEndpoint = "face-detect:8006"
	faceDescribeEndpoint = "face-describe:8009"
)

// TODO: Uncomment after fixing imgproxy facecrop
// //DescribeFace extracts face description points 
// // from a face picture
// func DescribeFace(message utils.Message) {
// 	// Set up a connection to the server.
// 	conn, err := grpc.Dial(faceDescribeEndpoint, grpc.WithInsecure())
// 	if err != nil {
// 		log.Fatalf("did not connect: %v", err)
// 	}
// 	defer conn.Close()
// 	c := pb.NewFaceDescribeClient(conn)

// 	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
// 	defer cancel()

// 	// Url := utils.GetResizedVolPath(message)

// 	faceDescription, err := c.DescribeFaces(ctx, &pb.DescribeFaceRequest{
// 		AlbumName: message.AlbumName,
// 		PhotoName: message.PhotoName,
// 	})

// 	if err != nil {
// 		log.Fatalf("could not greet: %v", err)
// 	}

// 	fmt.Println("Face describe", faceDescription)
// 	// return faceBoxes	
// }

// CropFace uses the Boundingbox to crop and save faces in a photo
func CropFace(message utils.Message, boundingBox *pb.BoundingBox, index int) {
	dirPath := fmt.Sprintf("%s/%s", utils.FACES_VOL, message.AlbumName)
	fileName  := fmt.Sprintf("%d_%s", index, message.PhotoName)
    filePath := fmt.Sprintf("%s/%s", dirPath, fileName)
    utils.CreateDirIfNotExist(dirPath)

    url := utils.GetFaceCropURL(message, boundingBox)

    response, e := http.Get(url)
    if e != nil {
        log.Fatal(e)
    }
    defer response.Body.Close()

    //open a file for writing
    file, err := os.Create(filePath)
    if err != nil {
        log.Fatal(err)
    }
    defer file.Close()

    // Use io.Copy to just dump the response body to the file. This supports huge files
    _, err = io.Copy(file, response.Body)
    if err != nil {
        log.Fatal(err)
	}
	
	// TODO: Uncomment after fixing imgproxy facecrop
	// faceMessage := utils.Message{
	// 	AlbumName: message.AlbumName,
	// 	PhotoName: fileName,
	// }

	// DescribeFace(faceMessage)

    fmt.Println("Success!")
}

// DetectFaces is a service to find the bounding box values
// for the faces in a photo
func DetectFaces(message utils.Message) *pb.BoundingBoxes {
	// Set up a connection to the server.
	conn, err := grpc.Dial(faceDetectEndpoint, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewFaceCoreClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	url := utils.GetResizedVolPath(message)

	faceBoxes, err := c.DetectFaces(ctx, &pb.PhotoURL{Url: url})

	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}

	fmt.Println("Face detect", faceBoxes)
	return faceBoxes
}


