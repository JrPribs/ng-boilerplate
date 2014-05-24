describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    browser.get('http://localhost:8080/');

    element(by.model('nameService.name')).sendKeys('Zelda');

    var greeting = element(by.className('name'));

    expect(greeting.getText()).toEqual('Well Zelda,');
  });
});