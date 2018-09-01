/******************************************************************
** FooterView: Contains a class for creating a view which contains
**             the footer for the main index view.
*******************************************************************
** Requires (loaded via HTML):
** ui.js
******************************************************************/

var FooterView = function () {

    this.ID = "footer_view";

    this.uim = new UIManager();
    this.progressBarValue = 0;

    //Adds a progress bar
    this.showProgressBar = function (limit) {
        var element = this.uim.addElement("body", this.ID, this.ID);
        var _outerRectangle = this.uim.addRectangleToID(this.ID, "progress_bar_bk", "", limit, "progress_bar_bk");
        var _innerRectangle = this.uim.addRectangleToID(this.ID, "progress_bar_value", "0/" + limit, 0, "progress_bar_value");
        return element;
    }
    //Updates an existing progress bar
    this.updateProgressBar = function (value, limit, ratio) {
        this.uim.clearContentsInID(this.ID);
        this.progressBarValue += value;
        var _outerRectangle = this.uim.addRectangleToID(this.ID, "progress_bar_bk", "", limit / ratio, "progress_bar_bk");
        var _innerRectangle = this.uim.addRectangleToID(this.ID, "progress_bar_value", value + "/" + limit, value / ratio, "progress_bar_value");
    }
};