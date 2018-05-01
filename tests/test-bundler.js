// ---------------------------------------
// Test Environment Setup
// ---------------------------------------
import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import chaiEnzyme from 'chai-enzyme';
import chaiImmutable from 'chai-immutable';

require('./test-polyfill');

// Add fusion chart mock as global object for testing.
function FusionCharts() {
  this.render = function() {};
}
FusionCharts.ready = function() {};

chai.use(chaiImmutable);
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiEnzyme());

global.chai = chai;
global.sinon = sinon;
global.expect = chai.expect;
global.should = chai.should();
global.FusionCharts = FusionCharts;

// ---------------------------------------
// Require Tests
// ---------------------------------------
// for use with karma-webpack-with-fast-source-maps
const __karmaWebpackManifest__ = [] // eslint-disable-line
const inManifest = (path) => ~__karmaWebpackManifest__.indexOf(path);

// require all `tests/**/*.spec.js`
const testsContext = require.context('./', true, /\.spec\.js$/);

// only run tests that have changed after the first pass.
const testsToRun = testsContext.keys().filter(inManifest);
(testsToRun.length ? testsToRun : testsContext.keys()).forEach(testsContext);

// require all `client/**/*.js` except for `main.js` (for isparta coverage reporting)
// const componentsContext = require.context('../client/', true, /^((?!main).)*\.js$/);
const componentsContext = require.context('../client/', true, /^static/);

componentsContext.keys().forEach(componentsContext);
