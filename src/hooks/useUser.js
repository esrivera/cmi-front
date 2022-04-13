import { useContext } from "react";
import Context from "src/context/userContext";
import loginService from "src/services/login";

export default function useUser() {
  const { jwt, setJWT } = useContext(Context);

  const loginUser =
    ((jwtU) => {
      setJWT(jwtU);
      console.log(jwt);
    },
    [setJWT]);

  const logoutUser =
    (() => {
      setJWT(null);
    },
    [setJWT]);

  return {
    isLogged: Boolean(jwt),
    loginUser,
    logoutUser,
  };
}
