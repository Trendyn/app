/**
 * Created by jeevan on 7/18/14.
 */
describe('e2e: main', function() {

  var elem;
  var elemsAll;

  beforeEach(function() {
    //browser.driver.manage().window().setSize(1120, 550)
    //browser.get('/');
    //ptor = protractor.getInstance();
    //ptor.ignoreSynchronization = true;
  });

  it('should load home page', function() {
    //browser.driver.manage().window().maximize();
    expect(browser.getLocationAbsUrl()).toMatch("/");
  });

  it('should have a Title', function() {
    expect(browser.getTitle()).toEqual('Delhiopinions');

    /*elm.getText().then(function (txt) {
      console.log(txt);
    });*/
  });

  it('should be able to click on Map elements', function() {
    /* There should be 3 polldata items */
//    elemsAll = element.all(by.repeater('(key, value) in pollsdata'));
//    expect(elemsAll.count()).toEqual(1);

    /* Click the 1st 'World' button */
//    elem = elemsAll.get(0).element(by.id('world'));
//    expect(elem.isPresent()).toBe(true);
//    elem.click();

    /* Click the 1st 'State' button */
//    elem = elemsAll.get(0).element(by.id('state'));
//    expect(elem.isPresent()).toBe(true);
//    elem.click();

    /* Click the 1st 'Country' button */
//    elem = elemsAll.get(0).element(by.id('country'));
//    expect(elem.isPresent()).toBe(true);
//    elem.click();

    /* Click the 1st 'Full Screen' button on the map */
//    elem = elemsAll.get(0).element(by.className('leaflet-control-zoom-fullscreen'));
//    expect(elem.isPresent()).toBe(true);
//    elem.click();

    /* Click the 1st 'Full Screen' button again to return to original map size */
//    elem.click();

    /* Click on some state in the first map */
    /* Temporarily disabling it, because I moved leaflet from svg to canvas to leaflet-images to work, thus following item wont work, because canvas doesnt have DOM attached to it.
    elem = element.all(by.className('leaflet-clickable')).get(30);
    expect(elem.isPresent()).toBe(true);
    elem.click();
    */
    //browser.driver.sleep(5000);

    /* Click the 1st 'Back' button on the map */
//    elem = elemsAll.get(0).element(by.className('leaflet-control-back-button'));
//    expect(elem.isPresent()).toBe(true);
//    elem.click();

  });

  it('should be able to click on Yes & vote', function() {
    //Find & click on main menu button
//    elem = element.all(by.id('option')).get(0);
//    expect(elem.isPresent()).toBe(true);
//    elem.click();

    /* We can check for the change in DOM when we handle the AJAX based on server response */
  });

  it('should be able to click on Menu & log out', function() {
    //Find & click on main menu button
//    elem = element.all(by.id('main-menu')).get(0);
//    expect(elem.isPresent()).toBe(true);

//    elem.click().then(function (){
//      elem = element.all(by.id('logout')).get(0);
//      expect(elem.isDisplayed()).toBe(true);
//      elem.click();
//    });
  });

});