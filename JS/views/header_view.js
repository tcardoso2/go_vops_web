/******************************************************************
** HeaderView: Contains a class for creating a view which contains
**             the header for the main index view.
*******************************************************************
** Requires (loaded via HTML):
** ui.js
******************************************************************/

var HeaderView = function () {

    this.ID = "header_view";
    this.label_title = "Time now is: ";

    this.uim = new UIManager();

    //Adds the time to the header
    this.showTime = function (model) {
        var element = this.uim.addElement("body", this.ID, this.ID);
        this.uim.addLabelToID(this.ID, this.label_title + JSON.stringify(model));
        return element;
    }
    //Updates existing time
    this.updateTime = function (model) {
        this.uim.clearContentsInID(this.ID);
        this.uim.addLabelToID(this.ID, this.label_title + JSON.stringify(model));
    }
};