package main

import (
	// "fmt"
	"encoding/json"
	"net/http"
	"github.com/kuruvi-bits/transform/services"
	"github.com/kuruvi-bits/transform/utils"
)

func main() {
	http.HandleFunc("/faceDetect", func(rw http.ResponseWriter, req *http.Request) {
		albumName := req.URL.Query().Get("albumName")
		photoName := req.URL.Query().Get("photoName")
		message := utils.Message{
			AlbumName: albumName,
			PhotoName: photoName,
		}
		faces := services.DetectFaces(message)
		for index, boundingBox := range faces.Boxes {
			services.CropFace(message, boundingBox, index)
		}
		result, _ := json.Marshal(&faces)
		rw.WriteHeader(http.StatusOK)
 	    rw.Write(result)
	})
	http.HandleFunc("/exif", func(rw http.ResponseWriter, req *http.Request) {
		albumName := req.URL.Query().Get("albumName")
		photoName := req.URL.Query().Get("photoName")
		message := utils.Message{
			AlbumName: albumName,
			PhotoName: photoName,
		}
		exif := services.Exif(message)
		result, _ := json.Marshal(&exif)
		rw.WriteHeader(http.StatusOK)
 	    rw.Write(result)
	})
	http.HandleFunc("/resize", func(rw http.ResponseWriter, req *http.Request) {
		albumName := req.URL.Query().Get("albumName")
		photoName := req.URL.Query().Get("photoName")
		message := utils.Message{
			AlbumName: albumName,
			PhotoName: photoName,
		}
		services.Resize(message)
		// exif := services.Exif(message)
		// result, _ := json.Marshal(&exif)
		// rw.WriteHeader(http.StatusOK)
 	    // rw.Write(result)
	})
	http.ListenAndServe(":1515", nil)
}
