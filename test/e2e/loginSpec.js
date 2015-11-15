/**
 * Created by jeevan on 7/23/14.
 */
describe('e2e:Login', function() {

  var loginUrl = process.env.NODE_ENV === 'production' ? 'http://localhost/login' : 'http://localhost:9000/login';

  beforeEach(function() {
    browser.ignoreSynchronization = true;
    browser.driver.get(loginUrl);
  });

  it('should go to login page', function() {
    browser.driver.getCurrentUrl().then(function(url){
      loginUrl = url;
      expect(url).toMatch('/login');
    });
  });

  it('should login', function() {
    //Input emailID/Password
    browser.driver.findElement(by.name('email')).sendKeys('root@root.com');
    browser.driver.findElement(by.name('password')).sendKeys('athakwanipdevanur');

    //browser.driver.findElement(by.xpath("//button[contains(text(),'Login')]")).click();
    browser.driver.findElement(by.id('signin')).click();

    //Wait for the home page to load
    browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        expect(loginUrl != url).toBeTruthy();
        return loginUrl != url;
       });
    });
  });

});