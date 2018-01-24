export const belongsToACollection = (user = {}, resourceToCheck = {}) => {
  const { favourites, collections } = user;

  const containedInFavorites = favourites.items.some(fav =>
    fav.attributes.resourceId === resourceToCheck.id);
  const containedInCollections = collections.items.some(collection =>
    collection.attributes.resources.some(resource => resource.id === resourceToCheck.id));

  return containedInFavorites || containedInCollections;
};

export default {
  belongsToACollection
};
