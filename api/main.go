package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

// Logger middleware logs incoming requests
func Logger(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Printf("[%s] %s %s %s", r.Method, r.RequestURI, r.RemoteAddr, time.Since(start))

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.URL.Path != "/post-score" && r.URL.Path != "/get-score" {
			ResponseWriter(w, Response{Data: nil, Status: http.StatusNotFound, Message: "Not found!"})
			return
		}
		next.ServeHTTP(w, r)
	}
}

func main() {
	fmt.Println("Starting server...")

	// Define handler functions
	http.HandleFunc("/post-score", Logger(HandlePostScore))
	http.HandleFunc("/get-score", Logger(HandleGetScore))

	// Start the server
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
