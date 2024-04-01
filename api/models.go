package main

type Player struct {
	Name  string `json:"name"`
	Rank  int    `json:"rank"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}

type Response struct {
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
	Status  int         `json:"status"`
}
