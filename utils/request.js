function get({ url, headers = [], withCredentials, onSuccess, onError }) {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.withCredentials = withCredentials;
  // Set request headers
  headers.forEach((h) => {
    request.setRequestHeader(h.key, h.value);
  });
  request.send(null);

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200 || request.status === 201 || request.status === 204) {
        try {
          const data = JSON.parse(request.responseText);
          onSuccess(data);
        } catch (e) {
          onSuccess(request.responseText);
        }
      } else {
        onError('error');
      }
    }
  };

  return request;
}

function post({ type, url, body, headers = [], onSuccess, onError, multipart }) {
  const request = new XMLHttpRequest();
  request.open(type || 'POST', url, true);
  // Set request headers
  headers.forEach((h) => {
    request.setRequestHeader(h.key, h.value);
  });
  request.send((multipart) ? body : JSON.stringify(body));

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200 || request.status === 201 || request.status === 204) {
        try {
          const data = JSON.parse(request.responseText);
          onSuccess(data);
        } catch (e) {
          onSuccess(request.responseText);
        }
      } else {
        try {
          const data = JSON.parse(request.responseText);
          onError(data.errors);
        } catch (e) {
          onError('error');
        }
      }
    }
  };

  return request;
}

function remove({ url, headers = [], onSuccess, onError }) {
  const request = new XMLHttpRequest();
  request.open('DELETE', url);
  // Set request headers
  headers.forEach((h) => {
    request.setRequestHeader(h.key, h.value);
  });

  request.send(null);

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200 || request.status === 201 || request.status === 204) {
        try {
          const data = JSON.parse(request.responseText);
          onSuccess(data);
        } catch (e) {
          onSuccess(request.responseText);
        }
      } else {
        onError('error');
      }
    }
  };

  return request;
}

export { get, post, remove };
