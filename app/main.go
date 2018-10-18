package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/tcardoso2/go_vops_web/api"
)

func main() {
	http.HandleFunc("/", index)
	http.HandleFunc("/api/echo", echo)
	http.HandleFunc("/api/timer", timer)
	fmt.Print("Server running on port " + port())
	http.ListenAndServe(port(), nil)
}

func port() string {
	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "8081"
	}
	return ":" + port
}

func index(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "go vops - version 0.1")
}

func echo(w http.ResponseWriter, r *http.Request) {
	message := r.URL.Query()["message"][0]
	w.Header().Add("Content-Type", "text/plain")
	fmt.Fprintf(w, message)
}

func timer(w http.ResponseWriter, r *http.Request) {
	theTime := api.Timer{Name: "My timer"}
	fmt.Printf("\nThe time is %v, %v %v, %v\n", theTime.NowTime.Weekday(), theTime.NowTime.Month(), theTime.NowTime.Day(), theTime.NowTime.Year())

	t, err := json.Marshal(theTime)
	if err != nil {
		panic(err)
	}
	w.Header().Add("Content-Type", "application/json; charset=utf-8")
	w.Write(t)
}
