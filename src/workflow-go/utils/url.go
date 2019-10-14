package utils

import (
	"fmt"
	pb "github.com/kuruvi-bits/transform/pb"
)

const (
	CADDT_SERVER_ENDPOINT = "192.168.1.100:2015"
	RESIZE_SERVER_ENDPOINT = "192.168.1.100:8080"
	UPLOADS_VOL = "album-uploads"
	RESIZED_VOL = "album-resized"	
	FACES_VOL = "album-faces"
)

type Message struct {
	AlbumName string `json:"albumName"`
	PhotoName string `json:"photoName"`
}

type URL struct {
	Upload string
	Resized string
	Faces string
}

func GetURL(message Message) URL {
	albumName := message.AlbumName
	photoName := message.PhotoName
	server := "http://" + CADDT_SERVER_ENDPOINT + "/" 
	uploadURL := server + UPLOADS_VOL + "/" + albumName + "/uploads/" + photoName
	resizedURL := server + RESIZED_VOL + "/" + albumName + "/" + photoName
	facesURL := server + FACES_VOL + "/" + albumName + "/" + photoName
	fmt.Println(uploadURL)
	url := URL{
		Upload: uploadURL,
		Resized: resizedURL,
		Faces: facesURL,
	}
	return url
}

func GetResizeURL(message Message) string {
	caddyURL := GetURL(message).Upload
    fmt.Println("Caddy URL", caddyURL)
	signedURL := GetSignedPathForResize(caddyURL)
	resizedURL := "http://" + CADDT_SERVER_ENDPOINT + "/" + signedURL
	return resizedURL
}

func GetFaceCropURL(message Message, boundingBox *pb.BoundingBox) string {
	caddyURL := GetURL(message).Resized
    fmt.Println("Caddy URL", caddyURL)
	signedURL := GetSignedPathForFaceCrop(caddyURL, boundingBox)
	resizedURL := "http://" + CADDT_SERVER_ENDPOINT + "/" + signedURL
	return resizedURL
}

func GetResizedVolPath(message Message) string {
	path := RESIZED_VOL + "/" + message.AlbumName + "/" + message.PhotoName
	return path
}