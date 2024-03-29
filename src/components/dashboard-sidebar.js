import { useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Divider, Drawer, Typography, useMediaQuery } from "@mui/material";
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { User as UserIcon } from "../icons/user";
import { Users as UsersIcon } from "../icons/users";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import EmojiObjectsRoundedIcon from "@mui/icons-material/EmojiObjectsRounded";
import AttractionsRoundedIcon from "@mui/icons-material/AttractionsRounded";
import EngineeringRoundedIcon from "@mui/icons-material/EngineeringRounded";
import AddAlertRoundedIcon from "@mui/icons-material/AddAlertRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import { Logo } from "./logo";
import { NavItem } from "./nav-item";

const items = [
  {
    href: "/inicio",
    icon: <HomeRoundedIcon fontSize="small" />,
    title: "Inicio",
  },
  {
    href: "/usuario/perfil",
    icon: <UserIcon fontSize="small" />,
    title: "Perfil",
  },
  {
    href: "/institucion",
    icon: <ApartmentRoundedIcon fontSize="small" />,
    title: "Instituciones",
  },
  {
    href: "/usuario",
    icon: <UsersIcon fontSize="small" />,
    title: "Usuarios",
  },
  {
    href: "/objetivo",
    icon: <EmojiObjectsRoundedIcon fontSize="small" />,
    title: "Objetivos Estratégicos",
  },
  {
    href: "/accion",
    icon: <AttractionsRoundedIcon fontSize="small" />,
    title: "Acciones Estratégicas",
  },
  {
    href: "/cmi/historico",
    icon: <ManageSearchRoundedIcon fontSize="small" />,
    title: "Histórico CMI",
  },
  {
    href: "/cmi",
    icon: <EngineeringRoundedIcon fontSize="small" />,
    title: "Gestión CMI",
  },
  {
    href: "/alerta/institucional",
    icon: <AddAlertRoundedIcon fontSize="small" />,
    title: "Alertas",
  },
  {
    href: "/estadistica",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Estadísticas",
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("sm"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink href="/inicio" passHref>
              <a>
                <Logo
                  sx={{
                    height: 42,
                    width: 42,
                  }}
                />
              </a>
            </NextLink>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: "#2D3748",
            my: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
          ))}
        </Box>
        <Divider sx={{ borderColor: "#2D3748" }} />
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
