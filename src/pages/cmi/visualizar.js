import Head from "next/head";
import { Box, CircularProgress, Container } from "@mui/material";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { useEffect, useState } from "react";
import { msmSwalError } from "src/theme/theme";
import VisualizarListToolbar from "src/components/cmi/visualizar-list-toolbar";
import VisualizarListResults from "src/components/cmi/visualizar-list-results";

const Visualizar = () => {
  const [update, setUpdate] = useState(0);
  const [action, setAction] = useState([]);
  const [idObjetivo, setIdObjetivo] = useState("");
  const [wordSearch, setWordSearch] = useState("");

  const query = {
    uri: apis.accion.get_id_objetive + idObjetivo,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
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
              <title>Gestión | CMI</title>
            </Head>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 8,
              }}
            >
              <Container maxWidth={false}>
                <VisualizarListToolbar
                  idObjetive={idObjetivo}
                  setIdObjetive={setIdObjetivo}
                  wordSearch={wordSearch}
                  setWordSearch={setWordSearch}
                ></VisualizarListToolbar>
                <Box sx={{ mt: 3 }}>
                  <VisualizarListResults actions={action} wordSearch={wordSearch} />
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
      case 4:
    }
  };

  const searchActions = () => {
    setUpdate(3);
    if (idObjetivo !== "") {
      clientPublic
        .get(
          query.uri + "?page=" + query.page + "&size=" + query.elementos + "&sort=" + query.sort,
          {
            params: { estado: true },
          }
        )
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

export default Visualizar;
