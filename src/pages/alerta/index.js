import Head from "next/head";
import { Box, CircularProgress, Container } from "@mui/material";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { useEffect, useState } from "react";
import { msmSwalError } from "src/theme/theme";
import { DashboardLayoutUser } from "src/components/dashboard-layout-user";
import AlertListToolbar from "src/components/alerta/alert-list-toolbar";
import AlertListResults from "src/components/alerta/alert-list-results";
import { parseJwt } from "src/utils/userAction";

const Alerta = () => {
  const [update, setUpdate] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [tipoAlerta, setTipoAlerta] = useState("env");
  const [wordSearch, setWordSearch] = useState("");
  const query = {
    uri: apis.alerta.get_by_emisor,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 50,
    sort: "fechaAlerta,desc",
  };
  const query2 = {
    uri: apis.alerta.get_by_receptor,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 50,
    sort: "fechaAlerta,desc",
  };

  const reload = () => {
    setUpdate(1);
  };

  useEffect(() => {
    if (update === 1) {
      setTimeout(() => {
        setUpdate(0);
      }, 500);
    }
  }, [update]);

  useEffect(() => {
    reload();
  }, [tipoAlerta, setTipoAlerta]);

  const RenderData = () => {
    if (update === 0) {
      tipoAlerta === "env" ? searchAlerts() : searchAlerts2();
    }
    switch (update) {
      case 0:
      case 1:
      case 2:
        return (
          <>
            <Head>
              <title>Alertas Institucionales | CMI</title>
            </Head>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 8,
              }}
            >
              <Container maxWidth={false}>
                <AlertListToolbar
                  updateView={reload}
                  tipoAlerta={tipoAlerta}
                  setTipoAlerta={setTipoAlerta}
                  wordSearch={wordSearch}
                  setWordSearch={setWordSearch}
                ></AlertListToolbar>
                <Box sx={{ mt: 3 }}>
                  <AlertListResults
                    alerts={alerts}
                    tipoAlerta={tipoAlerta}
                    updateView={reload}
                    wordSearch={wordSearch}
                  />
                </Box>
              </Container>
            </Box>
          </>
        );
      case 3:
        return (
          <div align="center">
            <CircularProgress />
          </div>
        );
    }
  };

  const searchAlerts = () => {
    setUpdate(3);
    const ISSERVER = typeof window === "undefined";
    const id = "";
    if (!ISSERVER) {
      const token = localStorage.getItem("token");
      id = parseJwt(token).instituteId;
    }
    clientPublic
      .get(
        query.uri + id + "?page=" + query.page + "&size=" + query.elementos + "&sort=" + query.sort
      )
      .then((result) => {
        if (result.status === 200) {
          setAlerts(result.data.content);
          setUpdate(2);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const searchAlerts2 = () => {
    setUpdate(3);
    const ISSERVER = typeof window === "undefined";
    const id = "";
    if (!ISSERVER) {
      const token = localStorage.getItem("token");
      id = parseJwt(token).instituteId;
    }
    clientPublic
      .get(
        query2.uri +
          id +
          "?page=" +
          query2.page +
          "&size=" +
          query2.elementos +
          "&sort.sorted=" +
          query2.sort
      )
      .then((result) => {
        if (result.status === 200) {
          setAlerts(result.data.content);
          setUpdate(2);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  return <RenderData />;
};

Alerta.getLayout = (page) => <DashboardLayoutUser>{page}</DashboardLayoutUser>;

export default Alerta;
