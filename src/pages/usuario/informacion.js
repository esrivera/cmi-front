import { DashboardLayout } from "src/components/dashboard-layout";
import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { AccountProfile } from "src/components/account/account-profile";
import { AccountProfileDetails } from "src/components/account/account-profile-details";
import { DashboardLayoutUser } from "src/components/dashboard-layout-user";
import { AccountProfileDetailsUser } from "src/components/account/account-profile-details-user";

const User = () => {
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
              <AccountProfileDetailsUser />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

User.getLayout = (page) => <DashboardLayoutUser>{page}</DashboardLayoutUser>;

export default User;
