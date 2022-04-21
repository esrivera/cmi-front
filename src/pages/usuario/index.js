import Head from "next/head";
import { Box, CircularProgress, Container } from "@mui/material";
import { DashboardLayout } from "src/components/dashboard-layout";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { useEffect, useState } from "react";
import { msmSwalError } from "src/theme/theme";
import UserListToolbar from "src/components/user/usuario-list-toolbar";
import UserListResults from "src/components/user/usuario-list-results";

const Usuario = () => {
  const [update, setUpdate] = useState(0);
  const [user, setUser] = useState([]);
  const [institution, setInstitution] = useState([]);
  const [idInstitution, setIdInstitution] = useState(1);
  const query = {
    uri: apis.user.get_all + idInstitution,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "name,asc",
  };

  const queryInstitution = {
    uri: apis.institution.get_all,
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
  }, [idInstitution]);

  const RenderData = () => {
    if (update === 0) {
      setTimeout(() => {
        searchUser();
      }, 500);
      if (institution.length < 1) {
        searchInstitutions();
      }
    }
    switch (update) {
      case 0:
      case 1:
      case 2:
        return (
          <>
            <Head>
              <title>Usuarios | CMI</title>
            </Head>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 8,
              }}
            >
              <Container maxWidth={false}>
                <UserListToolbar
                  updateView={reload}
                  idInstitute={idInstitution}
                  setIdInstitute={setIdInstitution}
                  institutions={institution}
                ></UserListToolbar>
                <Box sx={{ mt: 3 }}>
                  <UserListResults users={user} institutions={institution} updateView={reload} />
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

  const searchInstitutions = () => {
    clientPublic
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

  const searchUser = () => {
    setUpdate(3);
    clientPublic
      .get(query.uri + "?page=" + query.page + "&size=" + query.elementos + "&sort=" + query.sort)
      .then((result) => {
        if (result.status === 200) {
          setUser(result.data.content);
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
Usuario.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Usuario;
