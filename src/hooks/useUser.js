import { useContext } from "react";
import Context from "src/context/userContext";

export default function useUser() {
  const { jwt, setJWT } = useContext(Context);

  const loginUser =
    ((jwtU) => {
      setJWT(jwtU);
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
