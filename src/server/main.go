package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Message struct represents the data structure you want to send as JSON
type Message struct {
	Text      string    `json:"text"`
	Timestamp time.Time `json:"timestamp"`
}

type Player struct {
	Name  string `json:"name"`
	Rank  int    `json:"rank"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}

func Reader(conn *websocket.Conn) {

	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		// log.Println(string(p))
		// Unmarshal JSON data received from the client
		var receivedPlayer Player
		if err := json.Unmarshal(p, &receivedPlayer); err != nil {
			fmt.Println(string(p))
			log.Println("Error unmarshaling JSON:", err)
			return
		}
		log.Printf("Received JSON: %+v", receivedPlayer)

		// Process the received data (e.g., update JSON file on the server)
		if err := updateJSONFile(receivedPlayer); err != nil {
			log.Println("Error updating JSON file:", err)
		}
	}
	// defer conn.Close()

}
func updateJSONFile(newData Player) error {
	// Read existing data from the JSON file
	existingData, err := os.ReadFile("database.json")
	if err != nil {
		return err
	}

	// Unmarshal existing JSON data
	var existingMessages []Player
	if err := json.Unmarshal(existingData, &existingMessages); err != nil {
		return err
	}

	// Add the new data to the existing messages
	existingMessages = append(existingMessages, newData)

	// Marshal the updated data back to JSON
	updatedData, err := json.Marshal(existingMessages)
	if err != nil {
		return err
	}

	// Write the updated JSON data back to the file
	if err := os.WriteFile("database.json", updatedData, 0644); err != nil {
		return err
	}

	return nil
}
func Writer(conn *websocket.Conn) {
	// defer conn.Close()
	// Read the content of the JSON file
	jsonData, err := os.ReadFile("database.json")
	if err != nil {
		log.Println("Error reading JSON file:", err)
		return
	}

	// Send the JSON data to the client
	if err := conn.WriteMessage(websocket.TextMessage, jsonData); err != nil {
		log.Println("Error writing JSON to WebSocket:", err)
		return
	}
}

func routes() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Root endpoint
		fmt.Fprintf(w, "Root endpoint")
	})
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		upgrader.CheckOrigin = func(r *http.Request) bool {
			return true
		}
		ws, err := upgrader.Upgrade(w, r, nil)

		if err != nil {
			log.Println(err)
		}
		fmt.Println("Client successfully connected")
		go Reader(ws)
		go Writer(ws)
	})
}

func main() {
	fmt.Println("Starting websocket")
	routes()
	log.Fatal(http.ListenAndServe(":8080", nil))
	fmt.Println("the server is listening")
}
