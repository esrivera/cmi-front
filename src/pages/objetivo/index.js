import Head from "next/head";
import { Box, CircularProgress, Container } from "@mui/material";
import { DashboardLayout } from "src/components/dashboard-layout";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { useEffect, useState } from "react";
import { msmSwalError } from "src/theme/theme";
import ObjetiveListResults from "src/components/objetivo/objetive-list-results";
import ObjetiveListToolbar from "src/components/objetivo/objetive-list-toolbar";

const Objetivo = () => {
  const [update, setUpdate] = useState(0);
  const [objetive, setObjetive] = useState([]);
  const query = {
    uri: apis.objetive.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "nombre,asc",
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

  const RenderData = () => {
    if (update === 0) {
      searchObjetives();
    }
    switch (update) {
      case 0:
      case 1:
      case 2:
        return (
          <>
            <Head>
              <title>Objetivos Estratégicos | CMI</title>
            </Head>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 8,
              }}
            >
              <Container maxWidth={false}>
                <ObjetiveListToolbar updateView={reload}></ObjetiveListToolbar>
                <Box sx={{ mt: 3 }}>
                  <ObjetiveListResults objetives={objetive} updateView={reload} />
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

  const searchObjetives = () => {
    setUpdate(3);
    clientPublic
      .get(query.uri + "?page=" + query.page + "&size=" + query.elementos + "&sort=" + query.sort)
      .then((result) => {
        if (result.status === 200) {
          setObjetive(result.data.content);
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
Objetivo.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Objetivo;
