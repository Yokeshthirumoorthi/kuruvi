package main

import (
	"fmt"
	"net/http"
    "os/exec"
)

func execute() {
    out, err := exec.Command("hugo").Output()
    if err != nil {
        fmt.Printf("%s", err)
    }
    fmt.Println("Command Successfully Executed")
    output := string(out[:])
    fmt.Println(output)
}

func main() {
	http.HandleFunc("/buildhugo", func(rw http.ResponseWriter, req *http.Request) {
		execute()
	})
	http.ListenAndServe(":8079", nil)
}
