import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { parseJwt } from "src/utils/userAction";
import urlApi from "url";

const secret = process.env.SECRET;

export default function middleware(req) {
  const url = urlApi.parse(req.url);
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

  console.log("URL: ", url.pathname);
  console.log("API ROUTES: ", apiRoutes.includes(url.pathname));

  if (login.includes(url.pathname)) {
    console.log("RAIZ");
    if (jwt) {
      console.log("JWT");
      const rolUser = parseJwt(jwt).rol;
      if (rolUser === "ADMIN") {
        console.log("ADMIN");
        return NextResponse.redirect("/inicio");
      } else {
        console.log("USER");
        return NextResponse.redirect("/inicio/cmi");
      }
    } else {
      console.log("NO JWT RAIZ");
      return NextResponse.next();
    }
  } else if (apiRoutes.includes(url.pathname)) {
    console.log("URL MAIN");
    if (jwt) {
      try {
        console.log("VERIFY");
        verify(jwt, secret);
        return NextResponse.next();
      } catch (e) {
        console.log("NO VERIfY");
        return NextResponse.redirect("/");
      }
    } else {
      console.log("NO JWT");
      return NextResponse.redirect("/");
    }
  }
}
