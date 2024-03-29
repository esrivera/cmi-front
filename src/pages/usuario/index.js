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
  const [idInstitution, setIdInstitution] = useState("");
  const [wordSearch, setWordSearch] = useState("");
  const query = {
    uri: apis.user.get_all + idInstitution,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 50,
    sort: "name,asc",
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
  }, [idInstitution, setIdInstitution]);

  const RenderData = () => {
    if (update === 0) {
      searchUser();
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
                  wordSearch={wordSearch}
                  setWordSearch={setWordSearch}
                ></UserListToolbar>
                <Box sx={{ mt: 3 }}>
                  <UserListResults users={user} updateView={reload} wordSearch={wordSearch} />
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

  const searchUser = () => {
    setUpdate(3);
    if (idInstitution !== "") {
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
    } else {
      setUpdate(2);
    }
  };

  return <RenderData />;
};
Usuario.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Usuario;
