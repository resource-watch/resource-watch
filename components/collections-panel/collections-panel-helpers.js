export const belongsToACollection = (user = {}, resourceToCheck = {}) => {
  const { favourites, collections } = user;

  const containedInFavorites = favourites.items.some(fav =>
    fav.resourceId === resourceToCheck.id);
  const containedInCollections = collections.items.some(collection =>
    collection.resources.some(resource => resource.id === resourceToCheck.id));

  return containedInFavorites || containedInCollections;
};

export default { belongsToACollection };
