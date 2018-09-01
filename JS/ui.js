/******************************************************************
** UIManager:   Contains methods which facilitate the creation of
**              UI components in the view
*******************************************************************
** Requires (loaded via HTML):
** - moment.js
** Created on 27-Jul-2015 by Tiago
**
** Changes on 1-Oct-2016:
**  - Added addRectangleToID to be able to create a progress bar
** Changes on 16-May-2016:
**  - Added "levels" as argument for addJsonAsListView which allows
**    displaying children of json objects, drilling down over its
**    structure;
** Changes on 26-Sep-2015:
**  - Created method clearContentsInID
** Changes on 09-Sep-2015:
**  - Created method AddJsonAsListView
**  - Added before_text and after_text to the addElementToID function,
**    which adds text just before and below the element and / or after.
******************************************************************/
var UIManager = function () {
    this.addElement = function (where, id, class_name, text, b_text, a_text, prepend) {
        try {
            if (!text) { text = ""; }
            if (prepend === true)
            {
                $(where).prepend(
                    $("<div id='" + id + "'>").append(text).addClass(class_name));
            }else{
                $(where).append(
                    $("<div id='" + id + "'>").append(text).addClass(class_name));
            }
            if (b_text) {
                this.addLabelToID(id, b_text, 'left', true);
            }
            if (a_text) {
                this.addLabelToID(id, a_text, 'right', true);
            }
        } catch (e) {
            alert(e);
        }
        return $(document.getElementById(id));
    }
    this.addElementToID = function (where, id, class_name, text, before_text, after_text) {
        return this.addElement('#' + where, id, class_name, text, before_text, after_text);
    }
    this.clearContentsInID = function (id) {
        $('#' + id).empty();
    }
    //Adds a json object to the element as a table which takes its key
    //names and removes underscores to display them properly.
    //Requires json to be a valid JSON object
    this.addJsonAsListView = function (where, id, class_name, json, levels, callback) {
        try {
            $(where).append("<ul id='" + id + "'></ul>");
            list = $(document.getElementById(id));
            list.addClass('tabs_view'); //Adding a core element first
            if (class_name) {
                list.addClass(class_name);
            }
            //adds this function as attribute for later recursion
            var _recursiveFn;
            if (!isNaN(levels)) {
                _recursiveFn = this.addJsonAsListView;
            }
            //Appends each element
            $.each(json, function (k, v) {
                
                //Replace key underscores by spaces
                k_space = k.replace(/_/g, " ");
                //If a callback is defined, run it
                r = true;
                if (callback !== undefined) {
                    var r = callback(list, k, k_space, v);
                }
                //Will only run the rest as per normal if the callback returns true
                if (r) {
                    //Check if value is an object structure and if it is, calls
                    //recursively this function
                    if (typeof v === "object") {
                        if (levels === undefined) {
                            console.warn("Found json object in value, but levels argument was not provided when calling function 'addJsonAsListView()'.");
                        }
                        else {
                            _recursiveFn(where, id, class_name, v, levels - 1);
                        }
                    }
                    else if (isNaN(v)) {
                        //Check if value is a date, and if so, convert it using moment.js
                        if (moment(v).isValid()) {
                            v = moment(v).format("DD/MMM ddd hh:mmA");
                        }
                    }
                    list.append($('<li>')
                        .append($('<span class="k ' + k + '">').append(k_space + ':'))
                        .append($('<span class="v">').append(v))
                    );
                }
            });
        } catch (e) {
            alert(e);
        }
    }
    this.clearElementInID = function (where) {
        $('#' + where).empty();
    }
    this.addVerticalLineToID = function (where, id) {
        return this.addElement('#' + where, id, "vertical_line");
    }
    this.prependLabelToID = function (where, text, float, outside, css_class, timeToLive) {
        return this.addLabelToID(where, text, float, outside, css_class, timeToLive, true);
    }
    this.addLabelToID = function (where, text, float, outside, css_class, timeToLive, prepend) {
        var _count = $('#' + where + " div.label").length
        var _id = where + "_" + _count;
        //NOTE: Never call addElement here with before and after element because it will loop forever!
        var result;
        result = this.addElement('#' + where, _id, "label " + css_class, text, prepend);
        if (timeToLive && !isNaN(timeToLive)) {
            result.animate({ "left": "i-=1px" }, 8000, function () { $(this).hide(); });
        }
        if (float) {
            result.css("float", float);
            if (outside)
            {
                result.css("position", "absolute");
                switch (float) {
                    case "left":;
                        result.css("left", "-20px");
                        break;
                    case "right":;
                        result.css("right", "-20px");
                        break;
                    default:
                        break;

                }
            }
        }
        return result;
    }

    this.addRectangleToID = function (where, id, text, value, css_class) {
        var result;
        result = this.addElement('#' + where, id, "rectangle " + css_class, text);
        result.width(value);
        return result;
    }

    this.applyHvrFx = function (where, fx) {
        $('#' + where).parent().children().each(function () {
            $(this).removeClass(fx);
        });
        $('#' + where).addClass(fx);
    }
    this.zoomIn = function (where)
    {
        //Removes all zoommed in classes in parent first
        //this.removeClassOnSiblings('zoom_in');
        $('#' + where).parent().children().each(function () {
            $(this).removeClass('zoom_in');
        });
        $('#' + where).addClass('zoom_in');
    }
    this.highlight = function (where) {
        //Removes all highlighted in classes in parent first
        $('#' + where).parent().children().each(function () {
            $(this).removeClass('highlight');
        });
        $('#' + where).addClass('highlight');
    }
    this.addClassOnId = function (where, which) {
        //Removes all highlighted in classes in parent first
        $('#' + where).addClass(which);
    }
    this.removeClassOnId = function (where, which) {
        //Removes all highlighted in classes in parent first
        $('#' + where).removeClass(which);
    }
    this.removeClassOnSiblings = function (where, which) {
        _el = which;
        //FIXME: Does not work!
        //Removes all highlighted in classes in parent first
        $('#' + where).parent().children().each(function () {
            $(this).removeClass(_el);
        });
    }
}