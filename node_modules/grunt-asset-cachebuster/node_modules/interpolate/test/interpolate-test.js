var interpolate = require('../lib/interpolate');
var should = require('should');

describe("interpolate", function() {
    var data = {
      name: "Domino",
      colours: ["black", "white"],
      family: {
        mum: "Spot",
        dad: "Patch",
        siblings: []
      }
    };
    var template = "My cat's name is {name}. His colours are {colours.0} & {colours.1}. His mum is {family.mum}, his dad is {family.dad} and he has {family.siblings.length} brothers or sisters.";
    var result = "My cat's name is Domino. His colours are black & white. His mum is Spot, his dad is Patch and he has 0 brothers or sisters.";

  it("should interpolate a string", function() {
    interpolate(template, data).should.equal(result);
  });

  it("should be able to use different delimiters", function() {
    var tmpl;
    tmpl = template.replace(/\{/g, '{{');
    tmpl = tmpl.replace(/\}/g, '}}');
    interpolate(tmpl, data, {delimiter: '{{}}'}).should.equal(result);

    tmpl = template.replace(/\{/g, '<%');
    tmpl = tmpl.replace(/\}/g, '%>');
    interpolate(tmpl, data, {delimiter: '<%%>'}).should.equal(result);

    tmpl = template.replace(/[\{\}]/g, '|');
    interpolate(tmpl, data, {delimiter: '|'}).should.equal(result);
  });
});
