package main

import (
	//"html/template"
	"io/ioutil"
    "net/http"
)





func root_handler(w http.ResponseWriter, r *http.Request) {
    board := "resources/board.html"
    body, _ := ioutil.ReadFile(board)
    w.Write(body)
}

func main() {
    http.Handle("/", http.FileServer(http.Dir("resources/")))
    http.HandleFunc("/board.html", root_handler)
    http.ListenAndServe(":8080", nil)
}