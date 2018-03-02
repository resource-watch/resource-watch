import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import WRISerializer from 'wri-json-api-serializer';

export const setDataset = createAction('ADMIN_DATA/setDataset');

