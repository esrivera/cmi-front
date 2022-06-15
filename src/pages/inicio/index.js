import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { DashboardLayout } from "src/components/dashboard-layout";
import Image from "next/image";

const Dashboard = () => (
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
    </Box>
  </>
);

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
