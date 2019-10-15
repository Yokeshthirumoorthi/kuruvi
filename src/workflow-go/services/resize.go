package services

import (
    "fmt"
    "io"
    "log"
    "net/http"
    "os"
	utils "github.com/yokeshthirumoorthi/workflow-go/utils"
)

// Resize is a function used to resize photo
func Resize(message utils.Message) {
    dirPath := fmt.Sprintf("%s/%s", utils.RESIZED_VOL, message.AlbumName)
    filePath := fmt.Sprintf("%s/%s", dirPath, message.PhotoName)
    utils.CreateDirIfNotExist(dirPath)

    url := utils.GetResizeURL(message)

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

    fmt.Println("Success!")
}
