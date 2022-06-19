import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import Image from "next/image";
import apis from "src/utils/bookApis";
import { clientPublic } from "src/api/axios";
import { DashboardLayoutUser } from "src/components/dashboard-layout-user";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import { forwardRef } from "react";
import { parseJwt } from "src/utils/userAction";
import { msmSwalError } from "src/theme/theme";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Home = () => {
  const [alerts, setAlerts] = useState([]);
  const query = {
    uri: apis.alerta.get_by_pendientes,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "fechaAlerta,asc",
  };

  const searchAlerts = () => {
    const ISSERVER = typeof window === "undefined";
    const id = "";
    if (!ISSERVER) {
      const token = localStorage.getItem("token");
      id = parseJwt(token).instituteId;
    }
    clientPublic
      .get(
        query.uri + id + "?page=" + query.page + "&size=" + query.elementos + "&sort.sorted=" + query.sort
      )
      .then((result) => {
        if (result.status === 200) {
          setAlerts(result.data.content);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  useEffect(() => {
    searchAlerts();
  }, []);

  return (
    <>
      <Head>
        <title>Inico | CMI</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}></Grid>
          <h2>Bienvenido</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Image width={650} height={250} src="/img/logo.png" alt="logo" />
          </div>
        </Container>
        {alerts.length > 0 ? (
          <>
            <Stack spacing={2} sx={{ width: "40%", mt: 15, ml: 3 }}>
              <Alert severity="info">Tiene alertas institucionales pendientes!</Alert>
            </Stack>
          </>
        ) : null}
      </Box>
    </>
  );
};

Home.getLayout = (page) => <DashboardLayoutUser>{page}</DashboardLayoutUser>;

export default Home;
