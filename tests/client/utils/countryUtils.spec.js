import {
  getCountryId
} from '../../../commons/utils/countryUtils';

describe('countryUtils', function() {
  it('getCountryId should return country id.', function() {
    expect(getCountryId('IN')).to.deep.equal('104');
  });
});
