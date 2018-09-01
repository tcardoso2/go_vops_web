/******************************************************************
** FlightsView: Contains a class for creating a view which contains
**              flights in it.
*******************************************************************
** Requires (loaded via HTML):
** ui.js
**
** Changes (24Apr2016): Added assessor to flights
******************************************************************/

var FlightsView = function () {

    this.ID = "flights_view";
    this.ID_row = "flight_view";

    this.uim = new UIManager();
    this.fv;
    this.assignments = [];
    this.num_rows;
    this.rows = [];

    //Sets the container to Airline mode. Should only be run after "addContainer" function,
    //This means it adds the airlines key values to each row
    this.setToAirlineMode = function (airlines) {
        for (n = 0; n < this.rows.length; n++) {
            //$(this.rows[n][1]).toggleClass('undefined');
            var _el = $(this.rows[n][1]);
            _el.addClass(airlines[n]);
            _el.on("mouseover", { airline: airlines[n] === undefined ? "?" : airlines[n] }, function (event) {
                fdv.showFlightDetails(event.data);
            });
        }
    }
        
    //Adds a Row to the body of the Flights Viewer 
    this.addContainer = function (num_rows) {
        if (!num_rows) num_rows = 1;
        this.num_rows = num_rows;
        this.fvc = this.uim.addElement("body", this.ID, this.ID);
        for(n = 0; n < this.num_rows; n++)
        {
            _row = this.addRow(n);
            if (n == 0)
                this.setTimeReferenceOfRows(_row);
            _row.css('background-size', this.width_of_day);
        }
        //Adds time references to the container
        this.uim.addLabelToID(this.ID, this.period_start.format("DD/MMM ddd hh:mmA"));
        this.uim.addLabelToID(this.ID, this.period_end.format("DD/MMM ddd hh:mmA"), "right");
    }

    //Adds a Row to the body of the Flights Viewer
    this.addRow = function (row_number, unique_id) {
        //each row has a header
        _id = this.ID_row + row_number;
        this.fvh = this.uim.addElement("#" + this.ID, _id + "_header", "header " + unique_id);
        //Links the header with the row number
        this.fvh.attr("_row", row_number);

        this.fv = this.uim.addElement("#" + this.ID, _id, this.ID_row);
        //this.fv.css({ "marginTop": "+=" + row_number * 55 });

        //adds row to the rows collection, with space for a key
        this.rows.push([unique_id, "#" + _id + "_header"]);

        //returns the row
        return this.fv;
    }

    this.setTimeReferenceOfRows = function(row)
    {
        this.width = row.width();
        this.width_of_day = this.width / this.days;
        this.width_of_minute = this.width_of_day * 1000 / (24 * 60);  //1000 is added just to not loose precision
    }

    //Will fit a time period on the HTML, for that expects:
    //-A start Date type (will be the left-most coordinate on the screen)
    //-An end Date type (will be the right-most coordinate on the screen)
    this.setTimeReference = function (start_date, end_date) {
        
        this.period_start = moment(start_date);
        this.period_end = moment(end_date);
        this.days = this.period_end.diff(this.period_start, 'days');
    }

    //Adds a flight leg to the body element of the HTML
    this.addFlight = function (model, row_number) {
        //TODO: Create a object for this?
        f = this.addFlightToElement("#" + this.ID_row + row_number, model);
        f.on("mouseover", model, function (event) {
            fdv.showFlightDetails(event.data);
        });

    }

    //Adds a flight leg to the body element of the HTML, by key, instead of row number
    this.addFlightByKey = function (model) {
        //TODO: Create a object for this?
        var _el = $(".header." + model.carrier_id);
        f = this.addFlightToElement("#" + this.ID_row + _el.attr('_row'), model);
        f.on("mouseover", model, function (event) {
            fdv.showFlightDetails(event.data);
        });
    }

    //Removes all flight legs from the flight view
    this.removeAllFlights = function () {
        //TODO: Create a object for this?
        for (n = 0; n < this.num_rows; n++) {
            f = this.removeFlightsFromElement(this.ID_row + n);
        }
    }

    //Adds a flight leg to a given node name on the HTML view
    this.addFlightToElement = function (where, model) {
        var flight = this.uim.addElement(where, model.id, "flight", model.carrier_id + model.flight_id, model.start_station, model.end_station);
        //positions flight in grid
        this.minutes = this.period_start.diff(model.sobt, 'minutes');
        if (this.minutes > 0) {
            flight.animate({ "marginLeft": "-=" + (this.minutes * this.width_of_minute / 1000) + "px" });
        } else {
            flight.animate({ "marginLeft": "+=" + (-this.minutes * this.width_of_minute / 1000) + "px" });
        }
        //Adjust height of the flights because the css element of the flights is absolute and not relative;
        // Don't love this method but...
        try{
            flight.css('top', $(where).position().top + 18);
            this.assignments.push(flight);
        } catch (e)
        {
            alert(e);
        }
        return flight;
    }

    //Removes all flights from the element
    this.removeFlightsFromElement = function (where) {
        var flight = this.uim.clearContentsInID(where, "flight");
    }
    //Accessor: Finds the flight element with a certain id, does not work?
    //FIXME: Change to lower case
    this.GetFlightElementWithId = function (id) {
        $.each(this.assignments, function (k, v) {
            if (id === v.attr('id')) {
                return v;
            }
        });
    }

    //Updates the Flight with an alert marker
    //FIXME: Change to lower case
    this.UpdateFlightWithAlertMarker = function (al)
    {
        $.each(this.assignments, function (k, v) {
            if (al.object_id === v.attr('id')) {
                if (al.last_result_bool === false) {
                    //alert(JSON.stringify(al));
                    v.css('background-color', 'red')
                    //TODO: Add Alert text when hovering! Alerts object (in memory)! Alerts View
                    v.attr('last_alert', al.alert_message);
                }
                return;
            }
        });
    }
   

    //Adds a time line of the current time
    this.showTime = function (model)
    {
        return this.uim.addVerticalLineToID(this.ID, "timeline");
        //this.width_of_minute
    }
};