import Head from "next/head";
import { Box, CircularProgress, Container } from "@mui/material";
import { DashboardLayout } from "src/components/dashboard-layout";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { useEffect, useState } from "react";
import { msmSwalError } from "src/theme/theme";
import ActionListToolbar from "src/components/accion/accion-list-toolbar";
import ActionListResults from "src/components/accion/accion-list-results";

const Accion = () => {
  const [update, setUpdate] = useState(0);
  const [action, setAction] = useState([]);
  const [idObjetivo, setIdObjetivo] = useState("");
  const [wordSearch, setWordSearch] = useState("");
  const query = {
    uri: apis.accion.get_id_objetive + idObjetivo,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 50,
    sort: "identificador,asc",
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
  }, [idObjetivo, setIdObjetivo]);

  const RenderData = () => {
    if (update === 0) {
      searchActions();
    }
    switch (update) {
      case 0:
      case 1:
      case 2:
        return (
          <>
            <Head>
              <title>Acciones Estratégicas | CMI</title>
            </Head>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 8,
              }}
            >
              <Container maxWidth={false}>
                <ActionListToolbar
                  updateView={reload}
                  idObjetive={idObjetivo}
                  setIdObjetive={setIdObjetivo}
                  wordSearch={wordSearch}
                  setWordSearch={setWordSearch}
                ></ActionListToolbar>
                <Box sx={{ mt: 3 }}>
                  <ActionListResults actions={action} updateView={reload} wordSearch={wordSearch} />
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

  const searchActions = () => {
    setUpdate(3);
    if (idObjetivo !== "") {
      clientPublic
        .get(query.uri + "?page=" + query.page + "&size=" + query.elementos + "&sort=" + query.sort)
        .then((result) => {
          if (result.status === 200) {
            setAction(result.data.content);
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
Accion.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Accion;
