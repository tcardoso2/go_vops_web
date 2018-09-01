/******************************************************************
** Flights Delegate:  Contains a class for calling and managing the
**                    flights service.
*******************************************************************
** Requires (loaded via HTML):
** ui.js
**
** Created on 11-Jun-2016 by Tiago:
******************************************************************/

var FlightsDelegate = function () {
    this.url = window.location.href + 'FlightService.svc/flights';
    this.url_partial = window.location.href + 'FlightService.svc/partialresponse';
    this.interval_ms = 500000;
    //Interval for partial requests
    this.interval_ms_partial = 250;
    this.interval_fn;
    //TODO: This is hard coded now it should not
    this.data = { udor: '07052015' };
    this.last_response = {};
    this.last_response_headers = {};
    this.is_busy = false;
    this.is_storage_available = false;
    //This is where the client keeps track of the requests sent;
    this.clientPartialResponseIndex = 0;
    this.flightCountReceived = 0;

    //Checking if there is local storage (HTML5 available...)
    if (typeof (Storage) !== "undefined") {
        this.is_storage_available = true;
    } else {
        alert("Sorry! Your web-browser does not support local storage! Requests won't be cached, performance might be affected.");
    }

    this.call = function (handler_fn) {
        //Increasing responseIndex because this is required for subsequent partial responses.
        this.clientPartialResponseIndex = 1;
        get_url = $.ajax({
            /*FIXME: jsonp is not considered a valir CORS request? Therefore the headers nore not added
            */
            type: "GET",
            dataType: "jsonp",
            url: this.url,
            /*headers: { 'x-vops': '*' },*/
            // TODO: Change this for a non-hard-coded date of origin
            data: this.data,
            success: function (response) {
                handler_fn(response);
            }
        })
        .fail(function (response) {
            alert("Request for flights failed");
            console.log(response); // server response
            console.log("error");
        })
        .always(function (response) {
            console.log(response); // server response
        })
        .done(function (data, status, xhr) {
            console.log("complete");
        });
    }
    this.callPeriodically = function (handler_fn) {
        //calls periodically
        this.call(handler_fn);
        this.interval_fn = setInterval(function () {
            //TODO: not call fd? Create a local instance?
            fd.call(handler_fn);
        }, this.interval_ms);
    }
    //data should be: ?prid={partialRequestId}&wid={wId}&i={index}
    this.call_partial = function (handler_fn, data) {
        post_url = $.ajax({
            type: "POST",
            /*beforeSend: function (XMLHttpRequest) { XMLHttpRequest.setRequestHeader("Authorization", Token); }*/
            /*contentType: "application/x-www-form-urlencoded",*/
            dataType: "json",
            /*headers: { 'X-Vops': '*' },*/
            url: this.url_partial,
            data: data,
            success: function (response, status) {
                //FIXME! It seems success is not working!
                fd.is_busy = true;
                fv.updateProgressBar(fd.flightCountReceived, fd.last_response_headers.totalFlights, 20);
                handler_fn(response);
                fd.is_busy = false;
            },
        })
        .fail(function (response) {
            console.log(response); // server response
            console.error("Partial requests for flighs error?");
            alert("It seems there was some error?");
        })
        .always(function (response) {
            console.log(response); // server response
        })
        .done(function (data, status, xhr) {
            console.log("complete");
        });
    }
    this.callPartialPeriodically = function (handler_fn) {
        this.interval_fn = setInterval(function () {
            //TODO: not call fd? Create a local instance?
            //TODO: Only call if there is a last response r!!!!!!!
            if (fd.last_response) {
                fd.last_response_headers = fd.getPartialResponseHeaders(fd.last_response);
                //alert(JSON.stringify(fd.last_response_headers));
                if (fd.hasReceivedLatestPartialChunk() && fd.last_response_headers.prid && !fd.is_busy) {
                    fd.is_busy = true;
                    fd.call_partial(handler_fn, fd.last_response_headers);
                    //If everything goes fine with the request I increase the request index
                    fd.clientPartialResponseIndex += 1;
                }
            }
        }, this.interval_ms_partial);
    }

    this.hasReceivedLatestPartialChunk = function()
    //I need to check if the latest chunk is received so that I can make the next request,
    //This will only happen when the client request index matches the response index
    {
        return fd.last_response_headers && fd.clientPartialResponseIndex == fd.last_response_headers.i;
    }

    this.getPartialResponseHeaders = function (r) {
        var dataGuid, nextRequest, totalFlights;
        var loaded = 0; //FIX ME the client must keep track of this instead
        if (r.Headers && r.Headers.length > 0) {
            $.each(r.Headers, function (index, header) {
                switch (header.Key) {
                    case "VopsDataGuid":
                        dataGuid = header.Value;
                        break;
                    case "VopsNextRequest":
                        nextRequest = header.Value;
                        break;
                    case "VopsResponseIndex":
                        loaded += isNaN(parseInt(header.Value)) ? 0 : parseInt(header.Value);
                        break;
                    case "VopsTotalCount":
                        totalFlights = parseInt(header.Value);
                        break;
                    default:
                        alert("Invalid header!");
                        break;
                }
            });
        }
        else {
            console.error("No more partial responses, was that intended? WIP!!! Continuar daqui!");
            return {}
        }

        //Should not send the count but the index instead
        if (fd.last_response_headers && fd.last_response_headers.wid == dataGuid && fd.nextRequest != nextRequest) {
            this.flightCountReceived += r.Values.length;
        }

        return {
            prid: nextRequest,
            wid: dataGuid,
            loaded: loaded,
            totalFlights: totalFlights,
            i: loaded
        }
    }
    //Local storage handling
    this.resetLocalStorage = function()
    {
        if (fd.is_storage_available)
        {
            localStorage.setItem("flights", JSON.stringify([]));
        }
    }

    this.storeFlight = function (flight) {
        if (fd.is_storage_available) {
            localStorage.flights.push(flight);
        }
    }

    this.storeFlights = function (flightsArray) {
        try {
            //alert(JSON.stringify(flightsArray));
            if (fd.is_storage_available) {
                var prev = JSON.parse(localStorage.flights);
                prev.push.apply(prev, flightsArray);
                localStorage.setItem("flights", JSON.stringify(prev));
                return prev.length;
            }
            else {
                console.error("No local storage is available!");
            }
        } catch (e)
        {
            alert(e);
        }
        return 0;
    }

    this.storeAllFlights = function (flights) {
        if (fd.is_storage_available) {
            localStorage.flights = flights;
        }
    }
    this.getFlightStoreCount = function () {
        if (fd.is_storage_available) {
            return localStorage.flights.length;
        }
        return 0;
    }
};