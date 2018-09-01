/******************************************************************
** Alerts Delegate:  Contains a class for calling and managing the
**                  alerts service.
*******************************************************************
** Requires (loaded via HTML):
** ui.js
**
** Created on 24-Apr-2016 by Tiago:
******************************************************************/

var AlertsDelegate = function () {
    this.url = 'http://localhost:55087/FlightService.svc/flightalerts';
    this.interval_ms = 5000;
    this.interval_fn;
    this.data = { udor: '07052015' };

    this.call = function (handler_fn) {
        $.ajax({
            dataType: "jsonp",
            url: this.url,
            data: this.data,
            success: function (response) {
                handler_fn(response);
            }
        })
        .fail(function (response) {
            console.log(response); // server response
            console.error("error");
        })
        .always(function (response) {
            console.log(response); // server response
            console.log("complete");
        })
    }
    this.callPeriodically = function (handler_fn) {
        //calls periodically
        this.interval_fn = setInterval(function () {
            td.call(handler_fn);
        }, this.interval_ms);
    }
};