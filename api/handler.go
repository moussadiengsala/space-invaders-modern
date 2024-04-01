package main

import (
	"net/http"
	"strconv"
	"time"
)

// HandlePostScore handles POST requests to /post-score
func HandlePostScore(w http.ResponseWriter, r *http.Request) {
	response := Response{Status: http.StatusOK, Message: "ok"}
	if r.Method != "POST" {
		FormateResponse(&response, nil, http.StatusMethodNotAllowed, "Method not allowed")
		ResponseWriter(w, response)
		return
	}

	player := Player{}
	player.Name = r.FormValue("name")
	player.Score, _ = strconv.Atoi(r.FormValue("score"))

	// if isValid, err := ValidateNameScore(player.Name, player.Score); !isValid {

	// }

	player.Time = time.Now().Format("15:04")

	if errUpdateDatabse := UpdateDatabase(player); errUpdateDatabse != nil {
		FormateResponse(&response, nil, http.StatusInternalServerError, errUpdateDatabse.Error())
		ResponseWriter(w, response)
		return
	}

	ResponseWriter(w, response)
}

// HandleGetScore handles GET requests to /get-score
func HandleGetScore(w http.ResponseWriter, r *http.Request) {
	response := Response{Status: http.StatusOK, Message: "ok"}
	if r.Method != "GET" {
		FormateResponse(&response, nil, http.StatusMethodNotAllowed, "Method not allowed")
		ResponseWriter(w, response)
		return
	}

	params := r.URL.Query()
	limit := params.Get("limit")
	offset := params.Get("offset")

	players, err := GetPlayers()
	if err != nil {
		FormateResponse(&response, nil, http.StatusInternalServerError, err.Error())
		ResponseWriter(w, response)
		return
	}

	var limitedPlayers []Player
	if limit != "" && offset != "" {
		limitInt, _ := strconv.Atoi(limit)
		offsetInt, _ := strconv.Atoi(offset)
		if offsetInt < 0 {
			FormateResponse(&response, nil, http.StatusBadRequest, "Offset must be non-negative")
			ResponseWriter(w, response)
			return
		}
		if limitInt <= 0 {
			FormateResponse(&response, nil, http.StatusBadRequest, "Limit must be positive")
			ResponseWriter(w, response)
			return
		}
		if offsetInt >= len(players) {
			limitedPlayers = players // Offset beyond range, return all list
		} else {
			end := offsetInt + limitInt
			if end > len(players) {
				end = len(players)
			}
			limitedPlayers = players[offsetInt:end]
		}
	} else {
		limitedPlayers = players // No limit or offset, return all players
	}

	response.Data = limitedPlayers
	ResponseWriter(w, response)
}
