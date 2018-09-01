/******************************************************************
** TimeView:  Contains a class for creating a view which 
**            contains a time line in it.
*******************************************************************
** Requires (loaded via HTML):
** ui.js
**
** Created on 09-Sep-2015 by Tiago
**
** Changes on 09-Sep-2015:
**  - Created showTime
** Changes on 26-Sep-2015:
**  - Created updateTime
******************************************************************/

var TimeView = function () {

    this.ID = "time_view";

    this.uim = new UIManager();
    this.tv;
    this.now_line;
    this.updated_first_time = false;

    //Shows the time in the footer of the screen
    this.showView = function () {
        this.tv = this.uim.addElement("body", this.ID, this.ID);
    }

    //Adds a time line into the view referred in "where"
    this.showTime = function (where, model) {
        this.now_line = where.showTime(model, "timeline");
        this.updateTime(where, model, true);
    }

    //Updates existing time
    this.updateTime = function (where, model, animate) {
        minutes = where.period_start.diff(model, 'minutes')
        time_span_width = minutes * where.width_of_minute / 1000;
        var set_or_add = "-=";
        if (this.updated_first_time) {
            set_or_add = "=";
        } else {
            this.updated_first_time = true;
        }
        if (animate == true) {
            this.now_line.animate({"marginLeft": set_or_add + time_span_width + "px" });
        } else {
            this.now_line.css("marginLeft", Math.abs(time_span_width) + "px");
        }
    }
};