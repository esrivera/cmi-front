import { useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardNavbarUser } from "./dashboard-navbar-user";
import { DashboardSidebarUser } from "./dashboard-sidebar-user";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  [theme.breakpoints.up("sm")]: {
    paddingLeft: 280,
  },
}));

export const DashboardLayoutUser = (props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbarUser onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebarUser onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
    </>
  );
};
