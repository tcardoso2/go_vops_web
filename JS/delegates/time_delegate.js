/******************************************************************
** TimeDelegate:  Contains a class for calling and managing the
**                time service.
*******************************************************************
** Requires (loaded via HTML):
** ui.js
**
** Created on 26-Sep-2015 by Tiago:
******************************************************************/

var TimeDelegate = function () {
    this.url = window.location.href + 'TimeService.svc/time';
    this.interval_ms = 10000;
    this.interval_fn;

    this.call = function (handler_fn) {
        $.ajax({
            dataType: "jsonp",
            url: this.url,
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
        _internal_td= this
        this.interval_fn = setInterval(function () {
            _internal_td.call(handler_fn);
        }, this.interval_ms);
    }
};