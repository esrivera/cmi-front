import Head from "next/head";
import { Box, CircularProgress, Container } from "@mui/material";
import { DashboardLayout } from "src/components/dashboard-layout";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { useEffect, useState } from "react";
import { msmSwalError } from "src/theme/theme";
import CmiListToolbar from "src/components/cmi/accion-list-toolbar";
import CmiListResults from "src/components/cmi/accion-list-results";

const CMI = () => {
  const [update, setUpdate] = useState(0);
  const [objetive, setObjetive] = useState([]);
  const [action, setAction] = useState([]);
  const [idObjetivo, setIdObjetivo] = useState(90);
  const [idInstitucion, setIdInstitucion] = useState(1);
  const [institution, setInstitution] = useState([]);
  const queryInstitution = {
    uri: apis.institution.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "nombre,asc",
  };

  const query = {
    uri: apis.accion.get_id_objetive + idObjetivo,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "identificador,asc",
  };

  const queryAccion = {
    uri: apis.accion.get_id_institution + idInstitucion,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "identificador,asc",
  };

  const queryObjetive = {
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

  useEffect(() => {
    setTimeout(() => {
      setUpdate(0);
    }, 500);
  }, [idObjetivo, setIdObjetivo]);

  useEffect(() => {
    setTimeout(() => {
      setUpdate(0);
    }, 500);
  }, [idInstitucion, setIdInstitucion]);

  const RenderData = () => {
    if (update === 0) {
      if (objetive.length < 1 || institution.length < 1) {
        searchObjetives();
        searchInstitution();
      }
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
                <CmiListToolbar
                  updateView={reload}
                  idObjetive={idObjetivo}
                  setIdObjetive={setIdObjetivo}
                  objetives={objetive}
                  institution={institution}
                  idInstitucion={idInstitucion}
                  setIdInstitucion={setIdInstitucion}
                ></CmiListToolbar>
                <Box sx={{ mt: 3 }}>
                  <CmiListResults actions={action} updateView={reload} objetives={objetive} />
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

  const searchObjetives = () => {
    //setUpdate(3);
    clientPublic
      .get(
        queryObjetive.uri +
          "?page=" +
          queryObjetive.page +
          "&size=" +
          queryObjetive.elementos +
          "&sort=" +
          queryObjetive.sort
      )
      .then((result) => {
        if (result.status === 200) {
          setObjetive(result.data.content);
          //setUpdate(2);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const searchActions = () => {
    setUpdate(3);
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
  };

  const searchInstitution = async () => {
    await clientPublic
      .get(
        queryInstitution.uri +
          "?page=" +
          queryInstitution.page +
          "&size=" +
          queryInstitution.elementos +
          "&sort=" +
          queryInstitution.sort
      )
      .then((result) => {
        if (result.status === 200) {
          setInstitution(result.data.content);
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
//CMI.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CMI;
