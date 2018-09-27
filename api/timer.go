//Package api contain the various API functions for the program
package api

import (
	"encoding/json"
)

//Timer with current server time
type Timer struct {
	Name    string `json:"name"`
	NowTime int    `json:"nowtime"`
}

//
func (t Timer) ToJSON() []byte {
	ToJSON, err := json.Marshal(t)
	if err != nil {
		panic(err)
	}
	return ToJSON
}

func FromJSON(data []byte) Timer {
	timer := Timer{}
	err := json.Unmarshal(data, &timer)
	if err != nil {
		panic(err)
	}
	return timer
}
