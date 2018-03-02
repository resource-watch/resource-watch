import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import WRISerializer from 'wri-json-api-serializer';

export const setActiveTab = createAction('ADMIN_DATA_PAGE/setActiveTab');

