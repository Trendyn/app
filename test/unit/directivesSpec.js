/**
 * Created by jeevan on 5/10/14.
 */
'use strict';

describe('Unit testing ocApp directives', function() {
  var $compile;
  var $rootScope;
  var $element;

  // Load the ocApp module, which contains the directive
  beforeEach(module('ocApp'));
  beforeEach(module('templates'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){

    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  var mockBackend, loader;
  // _$httpBackend_ is the same as $httpBackend. Only written this way to
  // differentiate between injected variables and local variables.
  beforeEach(inject(function(_$httpBackend_, PollsLoader) {
    mockBackend = _$httpBackend_;
    loader = PollsLoader;
  }));

});

