import './node_modules/chai/chai.js';
import '../../node_modules/chai/chai.js';
import { initClient } from './client.js';

const { expect } = window.chai;

describe('client', function () {
  let screen;

  beforeEach(function () {
    screen = document.querySelector('#fixture');
    initClient(fixture);
  });

  it('render', function () {
    expect(screen.querySelector('h1')).to.have.property(
      'textContent',
      'Job Runner'
    );
  });
});
