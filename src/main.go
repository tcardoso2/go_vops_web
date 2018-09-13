package main

import (
	"fmt"
	"net/http"
	"os"
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
	t, err := json.Marshall(Timer{Name: "My timer", NowTime: 0})
	if err != nil {
		panic(err)
	}
	w.Header().Add("Content-Type", "application/json; charset=utf-8")
	w.Write(t)
}
