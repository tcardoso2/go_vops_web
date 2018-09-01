/******************************************************************
** Alerts Details View: Contains a class for creating a view which contains
**              alerts on flights in it.
*******************************************************************
** Requires (loaded via HTML):
** ui.js
**
** Created (16May2016): by Tiago Cardoso
******************************************************************/

var AlertDetailsView = function () {

    this.ID = "alert_details_view";

    this.uim = new UIManager();
    this.adv;
    this.alerts = [];

    //Adds the alert details into the screen
    this.showView = function () {
        
        this.adv = this.uim.addElement("body", this.ID, this.ID);
        //this.adv.addClass('');
    }

    //Adds an alert log leg to the body element of the HTML
    this.AddOrUpdateAlert = function (model) {
        //alert(JSON.stringify(model));
        this.uim.addJsonAsListView(this.ID, this.ID, "alert_details", model, undefined, this.DisplayAlertHandler);
    }

    //Clears the alerts in the Alert details
    this.ClearAlerts = function () {
        this.uim.clearContentsInID(this.ID);
    }


    //Accessor: Finds the flight element with a certain id, does not work?
    this.GetAlertElementWithId = function (id) {
        $.each(this.alerts, function (k, v) {
            if (id === v.attr('id')) {
                return v;
            }
        });
    }

    //Is called from uim as callback to handle the displaying of the Alert object
    //Return false to stop standard rendering, if true still renders normally
    this.DisplayAlertHandler = function (list, k, label, v)
    {
        switch (k) {
            case "object_id":
                this._last_object_id = v;
                break;
            case "alert_message":
                this._last_alert_msg = v;
                break;
            case "id":
                this._last_alert_id = v;
                break;
            case "last_result_bool":
                this._last_result_bool = v;
                break;
            case "rule_name":
                this._last_rule_name = v;
                break;
            case "treshold_bool":
            case "treshold_int":
                this._last_threshold = v;
                //Checks if there was a violation or not, will not display non-violations
                if (this._last_result_bool == false) {
                   new_alert = $('<li _objectId = ' + this._last_object_id + ' _ruleId = ' + this._last_rule_name + '>');
                    alert_msg = this._last_alert_msg == null ? "<No message>" : this._last_alert_msg;
                    list.append(new_alert
                        .append($('<span class="k ' + k + '">').append('Alert:'))
                        .append($('<span class="v">').append(alert_msg))
                    );
                    new_alert.hover(function () {
                        uim = new UIManager();
                        //uim.applyHvrFx($(this).attr("_objectId"), "zoom_in");
                        uim.applyHvrFx($(this).attr("_objectId"), "buzz_out");
                        $(this).addClass('hvr-wobble-horizontal');
                    });
                    new_alert.click(function () {
                        alert("Do something here! Add exceptions? Rule: " + $(this).attr("_ruleId"));
                    });
                }
                break;
            default:
                //ignores others
                break;

        }
        return false;
    }
};