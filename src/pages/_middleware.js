import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { parseJwt } from "src/utils/userAction";
import urlApi from "url";

const secret = "secret";

export default function middleware(req) {
  const url = urlApi.parse(req.url);
  const { cookies } = req;

  const jwtoken = cookies.token;

  const login = ["/", "/auth/login"];

  const apiRoutes = [
    "/alerta",
    "/inicio",
    "/cmi",
    "/accion",
    "/estadistica",
    "/objetivo",
    "/usuario",
  ];

  console.log("URL: ", url.pathname);
  console.log("API ROUTES: ", apiRoutes.includes(url.pathname));

  if (login.includes(url.pathname)) {
    console.log("RAIZ");
    if (jwtoken) {
      console.log("JWT");
      const rolUser = parseJwt(jwtoken).rol;
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
    if (jwtoken) {
      // try {
      //   var decoded = jwt.verify(jwtoken, "secret");
      //   console.log("DEC: ", decoded);
      // } catch (err) {
      //   console.log("ERROR: ", err);
      // }
      // return NextResponse.next();
      try {
        console.log("VERIFY");
        var decoded = jwt.verify(jwtoken, "secret");
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
