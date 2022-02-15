import { RESOURCE_TYPES } from 'types';

export interface Favorite {
  id: string;
  application: string;
  createdAt: Date;
  resourceId: string;
  resourceType: RESOURCE_TYPES;
  type: 'favourite';
  userId: string;
}
