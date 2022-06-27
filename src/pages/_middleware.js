import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { parseJwt } from "src/utils/userAction";

const secret = process.env.SECRET;

export default function middleware(req) {
  const url = req.url;
  const { cookies } = req;

  const jwt = cookies.token;

  // if (url === "/" || url.includes("/auth/login")) {
  //   if (jwt !== undefined) {
  //     const rolUser = parseJwt(jwt).rol;
  //     if (rolUser === "ADMIN") {
  //       return NextResponse.redirect("/inicio");
  //     } else {
  //       return NextResponse.redirect("/inicio/cmi");
  //     }
  //   }
  // }

  if (
    url.includes("/inicio") ||
    url.includes("/cmi") ||
    url.includes("/accion") ||
    url.includes("/alerta") ||
    url.includes("/estadistica") ||
    url.includes("/objetivo") ||
    url.includes("/usuario")
  ) {
    if (jwt === undefined) {
      return NextResponse.redirect("/");
    }
    try {
      verify(jwt, secret);
      return NextResponse.next();
    } catch (e) {
      return NextResponse.redirect("/");
    }
  }

  return NextResponse.next();
}
