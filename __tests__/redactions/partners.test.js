/* eslint-env jest */
require('dotenv').load();

import find from 'lodash/find';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import renderer from 'react-test-renderer';

import { getPartners } from '../../redactions/partners';

const initialState = { partners: { loading: false, list: [], error: null } };
const response = {
  "data": [{"id":"1","type":"partners","attributes":{"name":"Astro Digital","slug":"astro-digital","summary":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.","body":"Testing body","contact-email":"","contact-name":"Astro Digital","website":"","featured":true,"logo":{"medium":"//s3.amazonaws.com/wri-api-backups/resourcewatch/staging/partners/logos/000/000/001/medium/astrodigital.png?1501499985","thumb":"//s3.amazonaws.com/wri-api-backups/resourcewatch/staging/partners/logos/000/000/001/thumb/astrodigital.png?1501499985","original":"//s3.amazonaws.com/wri-api-backups/resourcewatch/staging/partners/logos/000/000/001/original/astrodigital.png?1501499985"},"white-logo":{"medium":"//s3.amazonaws.com/wri-api-backups/resourcewatch/staging/partners/white_logos/000/000/001/medium/astrodigital.png?1501499986","thumb":"//s3.amazonaws.com/wri-api-backups/resourcewatch/staging/partners/white_logos/000/000/001/thumb/astrodigital.png?1501499986","original":"//s3.amazonaws.com/wri-api-backups/resourcewatch/staging/partners/white_logos/000/000/001/original/astrodigital.png?1501499986"},"cover":{"cover":"//s3.amazonaws.com/wri-api-backups/resourcewatch/staging/partners/covers/000/000/001/large/bitmap.png?1492502156","original":"//s3.amazonaws.com/wri-api-backups/resourcewatch/staging/partners/covers/000/000/001/original/bitmap.png?1492502156"},"icon":{"icon":"/images/icon/missing.png","original":"/images/original/missing.png"},"partner-type":"","published":true},"links":{"self":"/api/partners/astro-digital"}}]
};
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Partners', () => {
  afterEach(() => {
    nock.cleanAll()
  });

  it('creates explore/GET_PARTNERS_SUCCESS when fetching partners has been done', () => {
    nock('https://staging.resourcewatch.org/api')
      .get('/partners')
      .reply(200, response);
    const expectedActions = [
      { type: 'explore/GET_PARTNERS_LOADING' },
      { type: 'explore/GET_PARTNERS_SUCCESS', payload: response.data }
    ];
    const store = mockStore(initialState);
    return store.dispatch(getPartners()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  // it('Checking API responses with success', () => {
  //   const store = mockStore(initialState);
  //   return store.dispatch(getPartners()).then(() => {
  //     const actions = store.getActions();
  //     const success = find(actions, { type: 'explore/GET_PARTNERS_SUCCESS' });
  //     expect(success).not.toBe(undefined);
  //     expect(success.payload.length).toBeGreaterThan(0);
  //   });
  // });
});
