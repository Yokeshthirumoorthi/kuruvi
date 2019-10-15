package services

import (
    "fmt"
    "io"
    "net/http"
    "os"
	utils "github.com/yokeshthirumoorthi/workflow-go/utils"
)

func getFilePath(message utils.Message) string {
    dirPath := fmt.Sprintf("%s/%s", utils.RESIZED_VOL, message.AlbumName)
    filePath := fmt.Sprintf("%s/%s", dirPath, message.PhotoName)
    utils.CreateDirIfNotExist(dirPath)

    return filePath
}

// DownloadFile will download a url to a local file. It's efficient because it will
// write as it downloads and not load the whole file into memory.
func DownloadFile(filepath string, url string) error {

    // Get the data
    resp, err := http.Get(url)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    // Create the file
    out, err := os.Create(filepath)
    if err != nil {
        return err
    }
    defer out.Close()

    // Write the body to file
    _, err = io.Copy(out, resp.Body)
    
    return err
}

// Resize is a function used to resize photo
func Resize(message utils.Message) {
    filePath := getFilePath(message)
    url := utils.GetResizeURL(message)

    // fileUrl := "https://golangcode.com/images/avatar.jpg"

    if err := DownloadFile(filePath, url); err != nil {
        panic(err)
    }
}