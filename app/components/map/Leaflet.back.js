"use strict";

 L.Control.Back = L.Control.extend({
    options: {
      position: "topleft",
      title: "Back"
    },

    onAdd: function () {
      var container = L.DomUtil.create("div", "leaflet-control-back leaflet-bar leaflet-control"),
        link = L.DomUtil.create("a", "leaflet-control-back-button leaflet-bar-part fa fa-reply", container);

      link.href = "#";
      link.title = this.options.title;

      L.DomEvent.on(link, "click", this._click, this);

      return container;
    },

    regCB: function (obj, cb) {
      this._obj = obj;
      this._cb = cb;
    },


    _click: function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);

      if (this._cb) {
        this._cb(this._obj);
      }
    }
  });

  L.control.back = function (options) {
    return new L.Control.Back(options);
  };
