import Head from "next/head";
import { Box, CircularProgress, Container } from "@mui/material";
import { DashboardLayout } from "src/components/dashboard-layout";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { useEffect, useState } from "react";
import { msmSwalError } from "src/theme/theme";
import CmiListToolbarUser from "src/components/cmi/cmi-list-toolbar";
import CmiListResultsUser from "src/components/cmi/cm-list-results";
import { parseJwt } from "src/utils/userAction";

const CMIG = () => {
  const [update, setUpdate] = useState(0);
  const [objetive, setObjetive] = useState([]);
  const [action, setAction] = useState([]);
  const [instituteId, setInstituteId] = useState(0);
  const [idObjetivo, setIdObjetivo] = useState(90);
  const [idInstitucion, setIdInstitucion] = useState();
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
    uri: apis.accion.get_id_institution_objetive + instituteId + "/" + idObjetivo,
    metodo: "get",
    estado: "true",
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
    //const token = localStorage.getItem("token");
    //const id = parseJwt(token).instituteId;
    setInstituteId(67);
    if (update === 0) {
      if (objetive.length < 1) {
        searchObjetives();
        searchInstitution();
      }
      searchActions();
      console.log(action);
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
                <CmiListToolbarUser
                  updateView={reload}
                  idObjetive={idObjetivo}
                  setIdObjetive={setIdObjetivo}
                  objetives={objetive}
                  institution={institution}
                  idInstitucion={idInstitucion}
                  setIdInstitucion={setIdInstitucion}
                ></CmiListToolbarUser>
                <Box sx={{ mt: 3 }}>
                  <CmiListResultsUser actions={action} updateView={reload} objetives={objetive} />
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
      .get(query.uri + "?page=" + query.page + "&size=" + query.elementos + "&sort=" + query.sort, {
        params: { estado: true },
      })
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

export default CMIG;
