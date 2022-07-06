import Head from "next/head";
import { Box, CircularProgress, Container } from "@mui/material";
import { DashboardLayout } from "src/components/dashboard-layout";
import InstitutionListResults from "src/components/institucion/institucion-list-results";
import InstitutionListToolbar from "src/components/institucion/institucion-list-toolbar";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { useEffect, useState } from "react";
import { msmSwalError } from "src/theme/theme";

const Institucion = () => {
  const [update, setUpdate] = useState(0);
  const [institution, setInstitution] = useState([]);
  const [wordSearch, setWordSearch] = useState("");
  const query = {
    uri: apis.institution.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 50,
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
      searchInstitution();
    }
    switch (update) {
      case 0:
      case 1:
      case 2:
        return (
          <>
            <Head>
              <title>Instituciones | CMI</title>
            </Head>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 8,
              }}
            >
              <Container maxWidth={false}>
                <InstitutionListToolbar
                  updateView={reload}
                  wordSearch={wordSearch}
                  setWordSearch={setWordSearch}
                ></InstitutionListToolbar>
                <Box sx={{ mt: 3 }}>
                  <InstitutionListResults
                    institutions={institution}
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

  const searchInstitution = async () => {
    setUpdate(3);
    await clientPublic
      .get(query.uri + "?page=" + query.page + "&size=" + query.elementos + "&sort=" + query.sort)
      .then((result) => {
        if (result.status === 200) {
          setInstitution(result.data.content);
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
Institucion.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Institucion;
