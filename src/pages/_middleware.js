import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { parseJwt } from "src/utils/userAction";
import { useLocation } from "react-router-dom";

const secret = process.env.SECRET;

export default function middleware(req) {
  const usePathname = () => {
    const location = useLocation();
    return location.pathname;
  };
  const url = usePathname();
  const { cookies } = req;

  const jwt = cookies.token;

  const login = ["/", "/auth/login"];

  const apiRoutes = [
    "/inicio",
    "/cmi",
    "/accion",
    "/alerta",
    "/estadistica",
    "/objetivo",
    "/usuario",
  ];

  console.log("URL: ", url);
  console.log("API ROUTES: ", apiRoutes.includes(url));
  if (login.includes(url)) {
    if (jwt) {
      const rolUser = parseJwt(jwt).rol;
      if (rolUser === "ADMIN") {
        return NextResponse.redirect("/inicio");
      } else {
        return NextResponse.redirect("/inicio/cmi");
      }
    } else {
      return NextResponse.next();
    }
  } else if (apiRoutes.includes(url)) {
    if (jwt) {
      try {
        verify(jwt, secret);
        return NextResponse.next();
      } catch (e) {
        return NextResponse.redirect("/");
      }
    } else {
      return NextResponse.redirect("/");
    }
  }
}
