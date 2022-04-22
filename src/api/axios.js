import axios from "axios";
const API_URL = "http://localhost:9012";
//const API_URL = "https://appcmi.herokuapp.com";

export const clientPublic = axios.create({
  baseURL: `${API_URL}`,
});

//axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
