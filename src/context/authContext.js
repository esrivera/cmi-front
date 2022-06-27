import React from "react";
import { useRouter } from "next/router";

const AuthContext = React.createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = React.useState({
    token: "",
  });

  const setUserAuthInfo = ({ data }) => {
    const token = localStorage.setItem("token", data);

    setAuthState({
      token,
    });
  };

  // checks if the user is authenticated or not

  const isUserAuthenticated = () => !!authState.token;

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState: (userAuthInfo) => setUserAuthInfo(userAuthInfo),
        isUserAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
