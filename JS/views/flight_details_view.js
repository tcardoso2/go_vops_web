/******************************************************************
** FlightsDetailsView:  Contains a class for creating a view which 
**                      contains flights details in it.
*******************************************************************
** Requires (loaded via HTML):
** ui.js
**
** Created on 09-Sep-2015 by Tiago
**
** Changes on 09-Sep-2015:
**  - Separated FlightDetailsView from FlightsView
** Changes on 09-Aug-2016:
**  - Added messaging basic function on the flights details view (to serve more as a log)
******************************************************************/

var FlightDetailsView = function () {

    this.ID = "flight_details_view";

    this.uim = new UIManager();
    this.fdv;

    this.showView = function () {
        this.fdv = this.uim.addElement("body", this.ID, this.ID);
    }

    //Adds flight details to the body element of the HTML
    this.showFlightDetails = function (model) {
        this.uim.clearElementInID(this.ID);
        //this.uim.addElementToID(this.ID, this.ID, "", JSON.stringify(model));
        this.uim.addJsonAsListView(this.ID, this.ID, "flight_details", model);
    }

    //The following should be only used for debug! TODO: Have an app flag for this!
    this.logMessage = function (message) {
        this.uim.prependLabelToID(this.ID, message, "left", false, undefined, 20000);
    }

    this.logError = function (message) {
        this.uim.prependLabelToID(this.ID, message, "left", false, "error");
    }

    this.logNewMessage = function (message) {
        this.uim.clearElementInID(this.ID);
        this.uim.prependLabelToID(this.ID, " " + message, "left", false, undefined, 20000);
    }
};