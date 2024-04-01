package main

import (
	"encoding/json"
	"net/http"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"
)

func ResponseWriter(w http.ResponseWriter, response Response) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(response.Status)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func FormateResponse(response *Response, data interface{}, status int, message string) {
	if data != nil {
		response.Data = data
	}
	if status != 0 {
		response.Status = status
	}
	if message != "" {
		response.Message = message
	}
}

func GetPlayers() ([]Player, error) {
	// Read file contents
	data, err := os.ReadFile("database.json")
	if err != nil {

		return nil, err
	}

	var players []Player
	if len(data) == 0 {
		return players, nil
	}

	// Unmarshal JSON data into a slice of Player structs
	if err := json.Unmarshal(data, &players); err != nil {
		return nil, err
	}

	return players, nil
}

func UpdateDatabase(player Player) error {
	players, err := GetPlayers()
	if err != nil {
		return err
	}

	// Append the new player to the slice
	players = append(players, player)

	// Sort players based on score (descending order)
	sort.Slice(players, func(i, j int) bool {
		return players[i].Score > players[j].Score
	})

	// Assign ranks based on sorted order
	for i := range players {
		players[i].Rank = i + 1
	}

	updatedData, err := json.Marshal(players)
	if err != nil {
		return err
	}

	// Write the updated JSON data back to the file
	if err := os.WriteFile("database.json", updatedData, 0644); err != nil {
		return err
	}

	return nil
}

// ValidateNameScore checks if the name and score are valid
func ValidateNameScore(name string, scoreStr string) (bool, error) {
	// Regular expression pattern for the name (assuming alphabets and spaces only)
	namePattern := "^[a-zA-Z\\s]+$"
	// Regular expression pattern for the score (assuming non-negative integers)
	scorePattern := "^[0-9]+$"

	// Compile the regular expressions
	nameRegex := regexp.MustCompile(namePattern)
	scoreRegex := regexp.MustCompile(scorePattern)

	// Check if the name matches the pattern
	if !nameRegex.MatchString(strings.Trim(name, " ")) {
		return false, nil
	}

	// Check if the score matches the pattern and convert it to an integer
	if !scoreRegex.MatchString(scoreStr) {
		return false, nil
	}
	score, err := strconv.Atoi(scoreStr)
	if err != nil {
		return false, err // Error parsing score as integer
	}
	if score < 0 {
		return false, nil // Negative scores are not allowed
	}

	return true, nil
}
