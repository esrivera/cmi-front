import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import { useRouter } from "next/router";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

export const DashboardNavbarUser = (props) => {
  const { onSidebarOpen, ...other } = props;
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    router.push("/");
  };

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: "calc(100% - 280px)",
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleLogout} color="default">
            <ExitToAppRoundedIcon />
            <p>Salir</p>
          </IconButton>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbarUser.propTypes = {
  onSidebarOpen: PropTypes.func,
};
