import * as queryString from 'query-string';

class FavouritesService {
  /**
   * Retrieve all favourites items of the user
   * @param {*} token User's token
   */
  static getFavourites(token) {
    const queryParams = queryString.stringify({
      application: process.env.APPLICATIONS
    });

    return new Promise((resolve, reject) => {
      fetch(`${process.env.WRI_API_URL}/favourite?${queryParams}`, {
        method: 'GET',
        headers: {
          Authorization: token
        }
      })
        .then((response) => {
          if (response.ok) return response.json();
          const { status, statusText } = response;

          const errorObject = {
            errors: {
              status,
              details: statusText
            }
          };
          throw errorObject;
        })
        .then(data => resolve(data))
        .catch(errors => reject(errors));
    });
  }

  /**
   * Creates a new favourite item attached to the current user
   * @param {*} token User's token
   * @param {*} resourceId Id of the resource
   * @param {*} resourceType Resource's type (can be dataset, layer or widget)
   */
  static createFavourite(token, resource = {}) {
    const { resourceId, resourceType } = resource;

    return new Promise((resolve, reject) => {
      fetch(`${process.env.WRI_API_URL}/favourite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({
          application: process.env.APPLICATIONS,
          resourceId,
          resourceType
        })
      })
        .then((response) => {
          if (response.ok) return resolve();
          const { status, statusText } = response;

          const errorObject = {
            errors: {
              status,
              details: statusText
            }
          };
          throw errorObject;
        })
        .then(data => resolve(data))
        .catch((errors) => { reject(errors); });
    });
  }

  /**
   * Deletes an existing favourite item attached to the current user
   * @param {*} token User's token
   * @param {*} resourceId Id of the resource
   */
  static deleteFavourite(token, resourceId) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.WRI_API_URL}/favourite/${resourceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: token
        }
      })
        .then((response) => {
          if (response.ok) return resolve();
          const { status, statusText } = response;

          const errorObject = {
            errors: {
              status,
              details: statusText
            }
          };
          throw errorObject;
        })
        .then(data => resolve(data))
        .catch((errors) => { reject(errors); });
    });
  }
}

export default FavouritesService;
