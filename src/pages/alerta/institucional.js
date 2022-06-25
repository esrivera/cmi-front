import Head from "next/head";
import { Box, CircularProgress, Container } from "@mui/material";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { useEffect, useState } from "react";
import { msmSwalError } from "src/theme/theme";
import { DashboardLayout } from "src/components/dashboard-layout";
import AlertInstitutionListToolbar from "src/components/alerta/alert-institution-list-toolbar";
import AlertInstitutionListResults from "src/components/alerta/alert-institution-list-results";

const AlertaInstitucional = () => {
  const [update, setUpdate] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [idInstitucion, setIdInstitucion] = useState("");
  const [wordSearch, setWordSearch] = useState("");
  const query = {
    uri: apis.alerta.get_by_emisor,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "fechaAlerta,desc",
  };

  const reload = () => {
    setUpdate(1);
  };

  useEffect(() => {
    reload();
  }, [idInstitucion, setIdInstitucion]);

  useEffect(() => {
    if (update === 1) {
      setTimeout(() => {
        setUpdate(0);
      }, 500);
    }
  }, [update]);

  const RenderData = () => {
    if (update === 0) {
      searchAlerts();
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
                <AlertInstitutionListToolbar
                  wordSearch={wordSearch}
                  idInstitucion={idInstitucion}
                  setIdInstitucion={setIdInstitucion}
                  setWordSearch={setWordSearch}
                ></AlertInstitutionListToolbar>
                <Box sx={{ mt: 3 }}>
                  <AlertInstitutionListResults alerts={alerts} wordSearch={wordSearch} />
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
    if (idInstitucion !== "") {
      clientPublic
        .get(
          query.uri +
            idInstitucion +
            "?page=" +
            query.page +
            "&size=" +
            query.elementos +
            "&sort=" +
            query.sort
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
    } else {
      setUpdate(2);
    }
  };

  return <RenderData />;
};

AlertaInstitucional.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AlertaInstitucional;
