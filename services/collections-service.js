class CollectionsService {
  /**
   * Retrieve all collections of the user
   * @param {*} token User's token
   */
  static getAllCollections(token) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.WRI_API_URL}/collection`, {
        method: 'GET',
        headers: {
          Authorization: token
        }
      })
        .then((response) => {
          const { status, statusText } = response;
          if (status === 200) return response.json();

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
   * Retrieve data of a specific collection
   * @param {*} token User's token
   * @param {*} collectionId Id of the collection we are asking for.
   */
  static getCollection(token, collectionId) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.WRI_API_URL}/collection/${collectionId}`, {
        method: 'GET',
        headers: {
          Authorization: token
        }
      })
        .then((response) => {
          const { status, statusText } = response;
          if (status === 200) return response.json();

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
   * Creates a new collection attached to the current user
   * @param {*} token User's token
   * @param {*} name Name of the new collection
   * @param {*} resources List of resources attached to the new collection (optional)
   */
  static createCollection(token, name, resources = []) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.WRI_API_URL}/collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({
          name,
          resources
        })
      })
        .then((response) => {
          const { status, statusText } = response;

          if (status === 200) return resolve();

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
   * Deletes an existing collection attached to the current user
   * @param {*} token User's token
   * @param {*} collectionId Id of the collection to be removed
   */
  static deleteCollection(token, collectionId) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.WRI_API_URL}/collection/${collectionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: token
        }
      })
        .then((response) => {
          const { status, statusText } = response;

          if (status === 200) return resolve();

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
   * Edits an existing collection attached to the current user
   * @param {*} token User's token
   * @param {*} collectionId Id of the collection to be edited
   * @param {*} name New name of the existing collection
   */
  static editCollection(token, collectionId, name) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.WRI_API_URL}/collection/${collectionId}`, {
        method: 'PATCH',
        headers: {
          Authorization: token
        },
        body: {
          name
        }
      })
        .then((response) => {
          const { status, statusText } = response;

          if (status === 200) return resolve();

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

  /* Resources management  */

  /**
   *
   * @param {*} token User's token
   * @param {*} collectionId Id of the collection to be edited
   * @param {*} resource Resource to be addded to the collection
   */
  static addResourceToCollection(token, collectionId, resource = []) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.WRI_API_URL}/collection/${collectionId}/resource`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ ...resource })
      })
        .then((response) => {
          const { status, statusText } = response;

          if (status === 200) return resolve();

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
   *
   * @param {*} token User's token
   * @param {*} collectionId Id of the collection to be edited
   * @param {*} resource Resource to be removed from the collection
   */
  static removeResourceFromCollection(token, collectionId, resource = []) {
    const { type, id } = resource;
    return new Promise((resolve, reject) => {
      fetch(`${process.env.WRI_API_URL}/collection/${collectionId}/resource/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token
        },
        body: {}
      })
        .then((response) => {
          const { status, statusText } = response;

          if (status === 200) return resolve();

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

export default CollectionsService;
