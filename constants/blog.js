// number of featured posts
export const SPOTLIGHT_CATEGORY = [125, 15];
/*
 * The category "uncategorized" always has the id 1 by default when
 * installling WordPress. More info about this can be found here:
 * https://wordpress.stackexchange.com/questions/187955/how-to-view-wordpress-default-category-ids
*/
export const UNCATEGORIZED_CATEGORY = 1;

export const ERROR_MESSAGE_FETCH_POSTS = 'Ops, something went wrong getting latest posts. Please, try later.';

export default {
  SPOTLIGHT_CATEGORY,
  UNCATEGORIZED_CATEGORY,
  ERROR_MESSAGE_FETCH_POSTS
};
