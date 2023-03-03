import axios from "axios";
//const API_URL = "http://localhost:9012";
const API_URL = "http://cmibak.midena.gob.ec";

// export const clientPublic = axios.create({
//   baseURL: `${API_URL}`,
// });

//axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");

const defaultOptions = {
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
};

// Create instance
export const clientPublic = axios.create(defaultOptions);

// Set the AUTH token for any request
clientPublic.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});
