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

  if (login.includes(url.pathname)) {
    if (jwtoken) {
      const rolUser = parseJwt(jwtoken).rol;
      if (rolUser === "ADMIN") {
        return NextResponse.redirect("/inicio");
      } else {
        return NextResponse.redirect("/inicio/cmi");
      }
    } else {
      return NextResponse.next();
    }
  } else if (apiRoutes.includes(url.pathname)) {
    if (jwtoken) {
      // try {
      //   var decoded = jwt.verify(jwtoken, "secret");
      //   console.log("DEC: ", decoded);
      // } catch (err) {
      //   console.log("ERROR: ", err);
      // }
      // return NextResponse.next();
      try {
        var decoded = jwt.verify(jwtoken, secret);
        return NextResponse.next();
      } catch (e) {
        return NextResponse.redirect("/");
      }
    } else {
      return NextResponse.redirect("/");
    }
  }
}
