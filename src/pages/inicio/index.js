import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
} from "@mui/material";
import { DashboardLayout } from "src/components/dashboard-layout";
import Image from "next/image";
import apis from "src/utils/bookApis";
import { clientPublic } from "src/api/axios";
import { useEffect, useState } from "react";
import { msmSwalError, msmSwalExito } from "src/theme/theme";

const Dashboard = () => {
  const [openActive, setOpenActive] = useState(false);
  const [estadoCarga, setEstadoCarga] = useState(false);
  const query = {
    uri: apis.accion.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "id,asc",
  };

  const searchActions = () => {
    clientPublic
      .get(
        query.uri +
          "?page=" +
          query.page +
          "&size=" +
          query.elementos +
          "&sort.sorted=" +
          query.sort
      )
      .then((result) => {
        if (result.status === 200) {
          if (result.data.content.length > 0) {
            setEstadoCarga(result.data.content[0].estadoCargaActividadMeta);
          }
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const handleActive = () => {
    setOpenActive(true);
  };

  const handleCloseActive = () => {
    setOpenActive(false);
  };

  const handleChangeEstado = () => {
    const estado = false;
    if (!estadoCarga) {
      estado = true;
    }
    clientPublic
      .patch(apis.accion.patch_estado_carga, null, {
        params: { estadoCarga: estado },
      })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          if (estadoCarga) {
            msmSwalExito("Se ha desactivado la carga de evidencias para las instituciones");
          } else {
            msmSwalExito("Se ha activado la carga de evidencias para las instituciones");
          }
          searchActions();
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400 && exception.response.status < 500) {
            msmSwalError("No se pudo cambiar el estado de la acción estratégica");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    setOpenActive(false);
  };

  useEffect(() => {
    searchActions();
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
            <Image width={750} height={350} src="/img/logo.png" alt="logo" />
          </div>
        </Container>
        <Stack spacing={2} sx={{ width: "30%", mt: 10, ml: 3 }}>
          <Button
            onClick={handleActive}
            variant="contained"
            style={{ backgroundColor: estadoCarga ? "#B60000" : "#45B500", fontSize: 15 }}
          >
            {estadoCarga ? "Desactivar carga de evidencias" : "Activar carga de evidencias"}
          </Button>
        </Stack>
      </Box>
      {/*Mesanje de confirmación*/}
      <Dialog
        open={openActive}
        onClose={handleCloseActive}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">¿Estas Seguro/a?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {!estadoCarga
              ? "¿Está seguro/a de querer activar la carga de evidencias para las instituciones?"
              : "¿Está seguro/a de querer desactivar la carga de evidencias para las instituciones?, los usuarios de las instituciones no podrán cargar ninguna evidencia una vez realizada esta acción"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangeEstado} autoFocus>
            Si
          </Button>
          <Button onClick={handleCloseActive}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
