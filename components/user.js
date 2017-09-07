/* global window */
/* global localStorage */
/* global XMLHttpRequest */
/**
 * A class to handle signing in and out and caching user data in userStore
 *
 * Note: We use XMLHttpRequest() here rather than fetch because fetch() uses
 * Service Workers and they cannot share cookies with the browser user
 * yet (!) so if we tried to get or pass the CSRF token it would mismatch.
 */

export default class User {
  constructor({ req } = {}) {
    this.user = {};
    try {
      if (req) {
        // If the user is associated with a user add user object to user
        if (req.user) {
          this.user = req.user;
        }
      } else {
        // If running on client, attempt to load user from localStorage
        this.user = this.getLocalStore('user');
      }
    } catch (err) {
      // Handle if error reading from localStorage or server state is safe to
      // ignore (will just cause user data to be fetched by ajax)

    }
  }


  // We can't do async requests in the constructor so access is via asyc method
  // This allows us to use XMLHttpRequest when running on the client to fetch it
  // Note: We use XMLHttpRequest instead of fetch so auth cookies are passed
  async getUser(forceUpdate) {
    // If running on the server, return user as will be loaded in constructor
    if (typeof window === 'undefined') {
      return new Promise((resolve) => {
        resolve(this.user);
      });
    }
    // If force update is set, clear data from store
    if (forceUpdate === true) {
      this.user = {};
      this.removeLocalStore('user');
    }

    // Attempt to load user data from userStore on every call
    this.user = this.getLocalStore('user');

    // If user data exists, has not expired AND forceUpdate is not set then
    // return the stored user we already have.
    if (this.user && Object.keys(this.user).length > 0) {
      return new Promise((resolve) => {
        resolve(this.user);
      });
    }

    // If we don't have user data, or it's expired, or forceUpdate is set
    // to true then revalidate it by fetching it again from the server.
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/auth/user', true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Update user with user info
            this.user = JSON.parse(xhr.responseText);

            // Set a value we will use to check this client should silently
            // revalidate based on the value of clientMaxAge set by the server
            // this.user.expires = Date.now() + this.user.clientMaxAge;

            // Save changes to user
            this.saveLocalStore('user', this.user);
            resolve(this.user);
          } else {
            reject(Error('XMLHttpRequest failed: Unable to get user'));
          }
        }
      };
      xhr.onerror = () => {
        reject(Error('XMLHttpRequest error: Unable to get user'));
      };
      xhr.send();
    });
  }

  // The Web Storage API is widely supported, but not always available (e.g.
  // it can be restricted in private browsing mode, triggering an exception).
  // We handle that silently by just returning null here.
  getLocalStore(name) {
    try {
      return JSON.parse(localStorage.getItem(name));
    } catch (err) {
      return null;
    }
  }

  saveLocalStore(name, data) {
    try {
      localStorage.setItem(name, JSON.stringify(data));
      return true;
    } catch (err) {
      return false;
    }
  }

  removeLocalStore(name) {
    try {
      localStorage.removeItem(name);
      return true;
    } catch (err) {
      return false;
    }
  }
}
