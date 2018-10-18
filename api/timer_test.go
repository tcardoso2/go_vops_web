package api

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestTimerToJSON(t *testing.T) {
	timer := Timer{Name: "My Timer", NowTime: time.Date(2009, time.November, 10, 23, 0, 0, 0, time.UTC)}
	json := timer.ToJSON()

	assert.Equal(t, `{"name":"My Timer","nowtime":"2009-11-10T23:00:00Z"}`,
		string(json), "Timer JSON marshalling went wrong.")
}

func TestTimerFromJSON(t *testing.T) {
	json := []byte(`{"name":"My Timer","nowtime":"2009-11-10T23:00:00Z"}`)
	timer := FromJSON(json)

	assert.Equal(t, Timer{Name: "My Timer", NowTime: time.Date(2009, time.November, 10, 23, 0, 0, 0, time.UTC)},
		timer, "Timer JSON unmarshalling went wrong.")
}
