/**
 * Created by athakwani on 12/26/13.
 */

"use strict";

function whichAnimationEvent(){
  var a;
  var el = document.createElement('fakeelement');
  var animations = {
    'animation':'animationend',
    'OAnimation':'oanimationEnd',
    'MozAnimation':'animationend',
    'WebkitAnimation':'webkitAnimationEnd'
  }

  for(a in animations){
    if( el.style[a] !== undefined ){
      return animations[a];
    }
  }
}


function ColorLuminance(hex, lum) {

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

function findMinMax (dict) {
  // There's no real number bigger than plus Infinity
  var lowest = Number.POSITIVE_INFINITY;
  var highest = Number.NEGATIVE_INFINITY;
  var tmp;
  for (var key in dict) {
    tmp = dict[key].totalcount;
    if (tmp < lowest) lowest = tmp;
    if (tmp > highest) highest = tmp;
  }

  return {'min': lowest, 'max': highest};
}

function isFunction (fn) {
  return typeof fn == 'function';
}

function OpinionMap(element, constants) {

  /*------------------------------------------------------------
     Instantiate Leaflet Map object
   ------------------------------------------------------------*/
  L.CRS.OCProj = L.extend({}, L.CRS.Simple, {
      scale: function (zoom) {
        return Math.pow(1.25, zoom);
      }
    }
  );

  this.map = L.map(element.$.map,
                          { crs: L.CRS.OCProj,
                            zoomControl:false,
                            zoomAnimationThreshold: 1000 });

  this.element = element;
  this.constants = constants;

  /*------------------------------------------------------------
    Remove Attribute Control from Map.
   ------------------------------------------------------------*/
  this.map.attributionControl.setPrefix("");

  /*------------------------------------------------------------
   Add Back control to the Map.
   ------------------------------------------------------------*/
  var back = L.control.back();
  back.regCB(this, this.goBack);
  this.map.addControl(back);

  /*------------------------------------------------------------
    Disable double click zoom.
   ------------------------------------------------------------*/
  this.map.doubleClickZoom.disable();

  /*------------------------------------------------------------
    Set the visible flag to indicate the visibility state of
    the maps.
   ------------------------------------------------------------*/
  this.visible = false;

  /*------------------------------------------------------------
    Zoom Level to indicate the current zoom level of the map.
   -1 = Not loaded
    0 = World
    1 = Country
    2 = State
  ------------------------------------------------------------*/
  this.zoomLevels = {
    MinZoom     : -1,
    WorldZoom   : 0,
    CountryZoom : 1,
    StateZoom   : 2,
    MaxZoom     : 2
  };

  this.currentZoomLevel = this.zoomLevels.MinZoom;

  /*------------------------------------------------------------
    Map State variables to indicate which country, state is
    loaded.
   ------------------------------------------------------------*/
  this.country = "";
  this.state   = "";
}

OpinionMap.prototype.show = function() {

  if (this.visible === false) {
    /*------------------------------------------------------------
       Defining Closure variables from object.
     ------------------------------------------------------------*/
    var omObj = this;

    var getContent = function (target) {
        if (target &&
            omObj.votes !== undefined &&
            omObj.votes[target.feature.properties.id] !== undefined) {
          return target.feature.properties.name +
                   "<br/>votes : " +
                   omObj.votes[target.feature.properties.id].totalcount;
        } else {
          return target.feature.properties.name;
        }
      };

    /*------------------------------------------------------------
      Create Result layer to show the highlighted map feature.
     ------------------------------------------------------------*/
    this.info = L.control();

    this.info.onAdd = function () {
        this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
        this.update(0);
        return this._div;
      };

    this.info.update = function (props) {
        this._div.innerHTML =
            "<strong>Vote Result</strong> <br/>" +
            (props ? getContent(props) : "Hover over a state");
      };

    this.info.addTo(this.map);

    /*-----------------------------------------------------------------------
       Return the feature style.
     ----------------------------------------------------------------------*/
    var fnFeatureStyle = function (feature) {
      omObj.constants.featureStyle.fillColor = omObj.constants.defaultColor;

      if (omObj.votes !== undefined &&
          omObj.votes[feature.properties.id] !== undefined) {
            omObj.constants.featureStyle.fillColor = omObj.featurefillColor( omObj.votes[feature.properties.id] );
      }
      return omObj.constants.featureStyle;
    };

    /*-----------------------------------------------------------------------
       Change the style of highlighted Feature.
     ----------------------------------------------------------------------*/
    var fnHighlightFeature = function (e) {
      var layer          = e.target;
      var properties     = layer.feature.properties;
      var highlightStyle = omObj.constants.disabledFeature;

      if (omObj.votes                !== undefined &&
          omObj.votes[properties.id] !== undefined &&
          omObj.votes[properties.id].totalcount > 0) {
        highlightStyle = omObj.constants.highlightFeature;
      }

      layer.setStyle(highlightStyle);

      if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
      }

      omObj.info.update(e.target);
    };

    /*-----------------------------------------------------------------------
      Reset the style of highlighted Feature.
     ----------------------------------------------------------------------*/
    var fnResetFeatureHighlight = function (e) {
      omObj.info.update(0);
      omObj.mapsLayer.resetStyle(e.target);
    };

    /*-----------------------------------------------------------------------
       Zoom to clicked feature.
     ----------------------------------------------------------------------*/
    var fnZoomToFeature = function (e) {
      var country = "";
      var state = "";
      var properties = e.target.feature.properties;

      if (properties.submap          === 1 &&
          omObj.votes                !== undefined &&
          omObj.votes[properties.id] !== undefined &&
          omObj.votes[properties.id].totalcount > 0) {
        switch(omObj.currentZoomLevel)
        {
          case omObj.zoomLevels.WorldZoom:
            country = properties.id;
            state   = "";
            break;
          case omObj.zoomLevels.CountryZoom:
            country = omObj.country;
            state   = properties.id;
            break;
          case omObj.zoomLevels.StateZoom:
            /* Do Nothing */
            break;
          default:
            /* Do Nothing */
            break;
        }

        if (omObj.currentZoomLevel  < omObj.zoomLevels.MaxZoom) {
          /*-----------------------------------------------------------------------
           Load the states/counties of zoomed Feature.
           ----------------------------------------------------------------------*/
          omObj.zooming = true;
          omObj.loadCountry = country;
          omObj.loadState = state;
          omObj.loadTargetFeature = e.target.feature;

          omObj.loadFeatures(omObj.loadCountry, omObj.loadState, omObj.currentZoomLevel  + 1, omObj.loadTargetFeature);

        }
      }
    };

    /*-----------------------------------------------------------------------
       Define mouse event for each feature.
     ----------------------------------------------------------------------*/
    var fnOnEachFeature = function (feature, layer) {
      layer.on({
        mouseover: fnHighlightFeature,
        mouseout: fnResetFeatureHighlight,
        click: fnZoomToFeature
      });
    };

    /*-----------------------------------------------------------------------
       Set the visibility of the map to true.
     ----------------------------------------------------------------------*/
    omObj.visible = true;

    /*------------------------------------------------------------
     Create Country, State and County geoJSON leaflet layer.
     ------------------------------------------------------------*/
    this.mapsLayer = L.geoJson(null, {
      style: fnFeatureStyle,
      onEachFeature: fnOnEachFeature
    });

    /*------------------------------------------------------------
     Create Country, State and County geoJSON leaflet layer.
     ------------------------------------------------------------*/
    this.oldLayer = L.geoJson(null, {
      style: fnFeatureStyle,
      onEachFeature: fnOnEachFeature
    });

    /*------------------------------------------------------------
     Add empty layer to maps.
     ------------------------------------------------------------*/
    this.map.addLayer(this.oldLayer);
    this.map.addLayer(this.mapsLayer);

    omObj.map.on("resize", function() {
      omObj.fitBounds();
    });

    omObj.map.on("zoomend", function() {
      omObj.busy = false;
    });

    /*-----------------------------------------------------------------------
     Store home Country & State information,
     ----------------------------------------------------------------------*/
    /* jshint camelcase: false */
    omObj.homeCountry = omObj.element.user.location.country_code;
    omObj.homeState   = omObj.element.user.location.state_code;
    omObj.zoomToHomeCountry();

  }

  return this;
};

OpinionMap.prototype.fitBounds = function()
{
  var omObj = this;
  omObj.map.fitBounds(omObj.mapsLayer.getBounds());
};

OpinionMap.prototype.zoomToCountry = function(country) {
  this.loadFeatures(country, "", this.zoomLevels.CountryZoom);
};

OpinionMap.prototype.zoomToHomeCountry = function() {
  this.zoomToCountry(this.homeCountry);
};

OpinionMap.prototype.zoomToState = function(country, state) {
  this.loadFeatures(country, state, this.zoomLevels.StateZoom);
};

OpinionMap.prototype.zoomToHomeState = function() {
  this.zoomToState(this.homeCountry, this.homeState);
};

OpinionMap.prototype.zoomToWorld = function() {
  this.loadFeatures("", "", this.zoomLevels.WorldZoom);
};

OpinionMap.prototype.featurefillColor = function(feature) {
  var maxVotes = feature.options[0];
  for (var optionId in feature.options) {
    if (maxVotes.count < feature.options[optionId].count) {
      maxVotes = feature.options[optionId];
    }
  }

/*
  var lum = 0.3;
  var normalizedCount = feature.totalcount - omObj.votesMinMax.min;
  var range           = omObj.votesMinMax.max - omObj.votesMinMax.min;
  lum                -= (normalizedCount / range) * (1 - lum);

  return utils.ColorLuminance(maxVotes.color, lum);
*/
  return maxVotes.color;
};

OpinionMap.prototype.loadFeatures = function(country, state, zoomLevel, targetFeature) {
  /*------------------------------------------------------------
   Defining Closure variables from object.
   ------------------------------------------------------------*/
  var omObj  = this;

  if (omObj.country          === country &&
    omObj.state            === state &&
    omObj.currentZoomLevel === zoomLevel) {
    return;
  }

  switch (zoomLevel)
  {
    case omObj.zoomLevels.WorldZoom:
      omObj.country = "";
      omObj.state   = "";
      break;

    case omObj.zoomLevels.CountryZoom:
      omObj.country = country;
      omObj.state = "";
      break;

    case omObj.zoomLevels.StateZoom:
      omObj.country = country;
      omObj.state   = state;
      break;

    default:
      omObj.country = "";
      omObj.state   = "";
      break;
  }

  var tempLayer = omObj.mapsLayer;
  omObj.mapsLayer = omObj.oldLayer;
  omObj.oldLayer = tempLayer;

  function disableFeature(el)
  {
    el.classList.add("leaflet-feature-disable");
  }

  function animateFeature(el)
  {
    el.classList.add("fadeOut");
    el.classList.add("leaflet-animation-duration");
  }

  omObj.addEffectOnLayers(omObj.oldLayer, null, false, disableFeature);

  omObj.addEffectOnLayers(omObj.oldLayer, targetFeature, false, animateFeature, function() {


    omObj.element.loading= true;

    omObj.oldLayer.eachLayer(function(layer) {
      if (layer.feature != targetFeature) {
        omObj.oldLayer.removeLayer(layer);
      }
    });


    function mapProgress (e)
    {
      if (e.lengthComputable) {
        omObj.element.mapProgress = parseInt((e.loaded / e.total * 100));
        console.log(omObj.element.mapProgress );
      }
    }

    function votesProgress (e)
    {
        if (e.lengthComputable) {
          omObj.element.votesProgress = parseInt((e.loaded / e.total * 100));
          console.log(omObj.element.votesProgress );
        }
    }

    /*------------------------------------------------------------
     Fetch State topoJSON data from server and convert it to
     geoJSON. Add the data to states layer of leaflet.
     ------------------------------------------------------------*/
    omObj.element.mapProgress = 0;
    window.$.ajax({
      url: omObj.constants.MapsUrl + "/" + country + "/" + state + "/map.json",
      xhrFields: {
        onprogress: mapProgress
      }
    }).done(function(maps) {
      var mapGeoJson = topojson.feature(maps, maps.objects.features);
      delete omObj.votes;
      omObj.currentZoomLevel = zoomLevel;

      switch (zoomLevel)
      {
        case omObj.zoomLevels.WorldZoom:
          omObj.element.votesProgress = 0;
          window.$.ajax({
            url: omObj.constants.worldVotesUrl + omObj.element.polldata.poll_id,
            xhrFields: {
              onprogress: votesProgress
            }
          }).done (function (votes)  {
            omObj.votes = votes;
            omObj.votesMinMax = findMinMax(votes);
            omObj.loadData(mapGeoJson);
          }).fail(function () {
            omObj.loadData(mapGeoJson);
          });
          break;

        case omObj.zoomLevels.CountryZoom:
          omObj.element.votesProgress = 0;
          window.$.ajax({
            url: omObj.constants.countryVotesUrl +  omObj.element.polldata.poll_id + "/" + country,
            xhrFields: {
              onprogress: votesProgress
            }
          }).done(function (votes)  {
            omObj.votes = votes;
            omObj.votesMinMax = findMinMax(votes);
            omObj.loadData(mapGeoJson);
          }).fail (function () {
            omObj.loadData(mapGeoJson);
          });
          break;

        case omObj.zoomLevels.StateZoom:
          omObj.element.votesProgress = 0;
          window.$.ajax({
            url: omObj.constants.stateVotesUrl + omObj.element.polldata.poll_id + "/" + country + "/" + state,
            xhrFields: {
              onprogress: votesProgress
            }
          }).done(function (votes)  {
            omObj.votes = votes;
            omObj.votesMinMax = findMinMax(votes);
            omObj.loadData(mapGeoJson);
          }).fail(function () {
            omObj.loadData(mapGeoJson);
          });
          break;

        default:
          break;
      }
    }).fail(function(){

    });
  });

};


OpinionMap.prototype.loadData = function(mapGeojson) {
  var omObj = this;
  omObj.mapsLayer.addData(mapGeojson);
  omObj.fitBounds();
  omObj.oldLayer.clearLayers();
  omObj.element.loading = false;

};

OpinionMap.prototype.goBack = function(omObj) {

  if (!omObj.busy) {
    omObj.busy = true;

    if(omObj.currentZoomLevel > omObj.zoomLevels.WorldZoom)
    {
      switch (omObj.currentZoomLevel - 1)
      {
        case 0:
          omObj.country = "";
          omObj.state   = "";
          break;

        case 1:
          omObj.state = "";
          break;

        case 2:
          /* Do Nothing */
          break;
      }
      omObj.loadFeatures(omObj.country, omObj.state, omObj.currentZoomLevel - 1);
    }
  }
};

OpinionMap.prototype.postVote = function(option) {
  var omObj = this;

  window.$.post(omObj.constants.votesurl + "/" + omObj.element.pollID + "/" + option.id)
    .done(function ()  {
      console.log("success");
    }).fail(function () {
      console.log("failed");
    });
};

OpinionMap.prototype.addEffectOnLayers = function(layers, targetFeature, randomize, fnStyle, cb) {
  var omObj = this;
  var layerCount;
  if (layers.getLayers) {
    layerCount = layers.getLayers().length;
  } else
  {
    layerCount = 1;
  }

  if (cb && layerCount == 0) {
    cb();
    return;
  }

  function Effect(el, effectCB) {
    if(el) {
      /* Listen for a transition! */
      var animationEvent = whichAnimationEvent();
      animationEvent && el.addEventListener(animationEvent, function(e) {
        var domEl = window.$(omObj.map._container).find(e.target)[0];
        if (domEl) {
          domEl.classList.add("leaflet-feature-hidden");
        }
        layerCount--;
        if (cb && layerCount == 0) {
          cb();
        }
      });

      if (effectCB)
        effectCB(el);
    }
  }

  function EffectRecurssive(layers, randomize, effectCB) {
    if (layers) {
      layers.eachLayer(function(layer) {
        if (layer.feature && targetFeature && layer.feature === targetFeature) {
        } else {
          var g = layer._container;
          if (g) {
            if (randomize == true) {
              setTimeout(function() {
                Effect(g, effectCB);
              }, Math.random(10) * 1000);
            } else
            {
              Effect(g, effectCB);
            }
          } else {
            EffectRecurssive(layer, randomize, effectCB);
          }
        }});
    }
  }

  EffectRecurssive(layers, randomize, fnStyle);
};
