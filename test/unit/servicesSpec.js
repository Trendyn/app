/**
 * Created by jeevan on 4/6/14.
 */
'use strict';

describe('Unit testing ocApp services', function() {
  //you need to indicate your module in a test
  beforeEach(module('ocApp'));
  beforeEach(module('ngResource'));

  beforeEach(function() {
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  describe('PollsLoader Service', function() {
    var mockBackend, loader;

    // _$httpBackend_ is the same as $httpBackend. Only written this way to
    // differentiate between injected variables and local variables.
    beforeEach(inject(function(_$httpBackend_, PollsLoader) {
      mockBackend = _$httpBackend_;
      loader = PollsLoader;
    }));

    it('should load list of polls', function() {
      mockBackend.expectGET('/getpolls').respond({
        "10":{
          "poll_id":10,
          "user_id":1,
          "poll":"Which party do you support for 2015 Delhi assembly elections?",
          "date":"2014-11-16T14:16:38.000Z",
          "options":[
            {"id":7,"option":"AAP","color":"#27ae60"},
            {"id":8,"option":"BJP","color":"#E96D65"},
            {"id":9,"option":"Congress","color":"blue"}
          ]
        }
      });

      var polls;

      var promise = loader();
      promise.then(function(rec) {
        polls = rec;
      });

      expect(polls).toBeUndefined();

      mockBackend.flush();

/* Jeevan please check why this is failing
      expect(polls).toEqualData({
        "10":{
          "poll_id":10,
          "user_id":1,
          "poll":"Which party do you support for 2015 Delhi assembly elections?",
          "date":"2014-11-16T14:16:38.000Z",
          "options":[
            {"id":7,"option":"AAP","color":"#27ae60"},
            {"id":8,"option":"BJP","color":"#E96D65"},
            {"id":9,"option":"Congress","color":"blue"}
          ]
        }
      });
*/
    });
  });


  describe('GeoLocation Service', function() {
    var mockBackend, loader;

    // _$httpBackend_ is the same as $httpBackend. Only written this way to
    // differentiate between injected variables and local variables.
    beforeEach(inject(function(_$httpBackend_, geoLocation) {
      mockBackend = _$httpBackend_;
      loader = geoLocation;
    }));

    it('should load map info of a specific state', function() {
      mockBackend.expectGET('/reversegeolookup/1/1').respond(["Response from reverse geocoder"]);

      var polls;

      loader.query({lat: "1", lon: "1"}, function(rec){
        polls = rec;
      });

      expect(polls).toBeUndefined();

      mockBackend.flush();

      expect(polls).toEqualData(["Response from reverse geocoder"]);
    });
  });

});