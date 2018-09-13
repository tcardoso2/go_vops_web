package api

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTimerToJSON(t *testing.T) {
	timer := Timer{Name: "My Timer", NowTime: 23200000}
	json := timer.ToJSON()

	assert.equal(t, `{ name: "My Timer", nowtime: 23200000 }`,
		string(json), "Timer JSON marshalling went wrong.")
}

func TestTimerFromJSON(t *testing.T) {
	json := []byte(`{ name: "My Timer", nowtime: 23200000 }`)
	timer := FromJSON(json)

	assert.Equal(t, Timer{Name: "My Timer", NowTime: 23200000},
		timer, "Timer JSON unmarshalling went wrong.")
}
