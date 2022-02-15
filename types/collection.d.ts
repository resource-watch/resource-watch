import { API_ENVS, RESOURCE_TYPES } from 'types';

export interface Resource {
  id: string;
  type: RESOURCE_TYPES;
}

export interface Collection {
  application: string;
  env: API_ENVS;
  id: string;
  name: string;
  ownerId: string;
  resources: Resource[];
  type: 'collection';
}
