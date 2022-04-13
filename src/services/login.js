const ENDPOINT = "http://localhost:9002";

export default function login({ username, password }) {
  alert("SERVICE");
  return fetch(`${ENDPOINT}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => {
      alert("400");
      if (!res.ok) throw new Error("No hay respuesta del servidor");

      return res.json();
    })
    .then((res) => {
      alert("200");
      const { jwt } = res;
      return jwt;
    });
}
