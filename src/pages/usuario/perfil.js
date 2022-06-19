import Head from "next/head";
import { Box, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { parseJwt } from "src/utils/userAction";
import { DashboardLayout } from "src/components/dashboard-layout";
import { AccountProfileDetails } from "src/components/account/account-profile-details";
import { msmSwalError } from "src/theme/theme";
const Perfil = () => {
  const [update, setUpdate] = useState(0);
  const [userInfo, setUserInfo] = useState({});

  const reload = () => {
    setUpdate(1);
  };

  useEffect(() => {
    if (update === 1) {
      setTimeout(() => {
        setUpdate(0);
      }, 500);
    }
  }, [userInfo, setUserInfo]);

  useEffect(() => {
    if (update === 1) {
      setTimeout(() => {
        setUpdate(0);
      }, 1500);
    }
  }, [update]);

  const RenderData = () => {
    if (update === 0) {
      searchUser();
    }
    if (update === 4) {
      searchUser1();
    }
    switch (update) {
      case 0:
      case 1:
      case 2:
        return (
          <>
            <Head>
              <title>Perfil | CMI</title>
            </Head>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 8,
              }}
            >
              <Container maxWidth="lg">
                <Typography sx={{ mb: 3 }} variant="h4">
                  Información Personal
                </Typography>
                <Grid container spacing={3}>
                  <Grid item lg={12} md={6} xs={12}>
                    <AccountProfileDetails user={userInfo} />
                  </Grid>
                </Grid>
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
        return (
          <div align="center">
            <CircularProgress />
          </div>
        );
    }
  };

  const searchUser = () => {
    setUpdate(3);
    const ISSERVER = typeof window === "undefined";
    const ci = "";
    if (!ISSERVER) {
      const token = localStorage.getItem("token");
      ci = parseJwt(token).CI;
    }
    clientPublic
      .get(apis.user.get_ci + ci)
      .then((result) => {
        if (result.status === 200) {
          setUserInfo(result.data);
          setUpdate(4);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const searchUser1 = () => {
    setUpdate(3);
    const ISSERVER = typeof window === "undefined";
    const ci = "";
    if (!ISSERVER) {
      const token = localStorage.getItem("token");
      ci = parseJwt(token).CI;
    }
    clientPublic
      .get(apis.user.get_ci + ci)
      .then((result) => {
        if (result.status === 200) {
          setUserInfo(result.data);
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

Perfil.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Perfil;
