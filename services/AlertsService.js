import axiosAPI from './Alerts';

export const fetchAlerts = (token, sql) => {
  return axiosAPI.get('/query', {
    //withCredentials: true,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": token
    },
    params: { sql }
  })

    .then((response) => {
      if (response.status >= 200 && response.status < 400) {
        return response.data.data
      }
      else {
        throw Error(response.statusText);
      }
    })
    .catch((err) => {
      console.error(err);
    })

}


export default { fetchAlerts };
