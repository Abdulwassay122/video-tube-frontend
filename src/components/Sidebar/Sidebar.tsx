"use client";
import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { alpha } from "@mui/material/styles";
import { useUser } from "@/app/context/UserContext";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import useMediaQuery from "@mui/material/useMediaQuery";

import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";

import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";

import SlowMotionVideoOutlinedIcon from "@mui/icons-material/SlowMotionVideoOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonIcon from "@mui/icons-material/Person";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import { apiRequest } from "@/utils/apiRequest";
import { apiUrl } from "@/utils/format";
import { toast } from "react-toastify";

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "35ch",
      "&:focus": {
        width: "55ch",
      },
    },
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "100px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const sidebarItems = [
  {
    label: "Home",
    href: "/",
    icon: <HomeOutlinedIcon />,
    activeIcon: <HomeIcon />,
  },
  {
    label: "Subscriptions",
    href: "/subscriptions",
    icon: <SubscriptionsOutlinedIcon />,
    activeIcon: <SubscriptionsIcon />,
  },
  {
    label: "Playlists",
    href: "/playlists",
    icon: <PlaylistPlayOutlinedIcon />,
    activeIcon: <PlaylistPlayIcon />,
  },
  {
    label: "You",
    href: "/you",
    icon: <PersonOutlineIcon />,
    activeIcon: <PersonIcon />,
  },
];

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const theme = useTheme();
  const { user, setUser } = useUser();

  const [open, setOpen] = React.useState(false);

  const [search, setSearch] = React.useState<string>("");

  const isMobile = useMediaQuery("(max-width:500px)");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // for avatar drop down menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openn = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Logout Function
  const handleLogout = async () => {
    try {
      // Use centralized apiRequest helper instead of axios directly
      const data = await apiRequest(
        "POST",
        `${apiUrl}/api/v1/users/logout`,
        router,
      );

      console.log(data);
      toast.success(data.message);
      setUser(null);
    } catch (error: any) {
      // ERROR: backend message exactly
      const message = error?.message || "Something went wrong";
      toast.error(message);
      // setError(message);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim().length > 0) {
        router.push(`/search?search=${encodeURIComponent(search)}`);
      } else {
        router.push(`/`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          {!isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  marginRight: 5,
                },
                open && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Link href="/">
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" }, fontWeight: "bold" }}
            >
              WeTube
            </Typography>
          </Link>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onChange={handleSearch}
                value={search}
                placeholder="Search"
                // inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Box>

          {/* Icons */}
          {user !== null ? (
            <Box sx={{ display: "flex" }}>
              <IconButton
                type="button"
                onClick={() => router.push("/studio/videos")}
                size="large"
                color="inherit"
              >
                <VideoCallIcon />
              </IconButton>
              <IconButton onClick={handleClick} size="large" color="inherit">
                <Avatar
                  src={user?.avatar}
                  alt={user?.username}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openn}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={() =>
                    router.push(
                      `/profile?username=${encodeURIComponent(user?.username || "")}`,
                    )
                  }
                >
                  <Avatar
                    src={user?.avatar}
                    alt={user?.username}
                    sx={{ width: 32, height: 32 }}
                  />{" "}
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => router.push("/user-login")}>
                  <ListItemIcon>
                    <PersonAdd fontSize="small" />
                  </ListItemIcon>
                  Add another account
                </MenuItem>
                <MenuItem onClick={() => router.push("/studio")}>
                  <ListItemIcon>
                    <SlowMotionVideoOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  Studio
                </MenuItem>
                {/* <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem> */}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                alignItems: "center",
              }}
            >
              {/* Login */}
              <Button
                onClick={() => router.push("/user-login")}
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#fff",
                  color: "#000",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                Login
              </Button>

              {/* Sign Up */}
              <Button
                onClick={() => router.push("/user-register")}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "#fff",
                  color: "#fff",
                  "&:hover": {
                    borderColor: "#fff",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Sign up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {!isMobile && (
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {sidebarItems.map(({ label, href, icon, activeIcon }) => {
              const isActive = pathname === href;

              return (
                <ListItem key={label} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    component={Link}
                    href={href}
                    selected={isActive}
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      justifyContent: open ? "initial" : "center",
                      borderRadius: "10px",
                      mx: 1,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: "center",
                        mr: open ? 3 : "auto",
                      }}
                    >
                      {isActive ? activeIcon : icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={label}
                      sx={{
                        opacity: open ? 1 : 0,
                        fontWeight: isActive ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Drawer>
      )}

      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: 56,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
            borderTop: "1px solid rgba(0,0,0,0.1)",
            zIndex: theme.zIndex.appBar,
          }}
        >
          {sidebarItems.map(({ label, href, icon, activeIcon }) => {
            const isActive = pathname === href;

            return (
              <IconButton
                key={label}
                onClick={() => router.push(href)}
                color={isActive ? "primary" : "default"}
              >
                {isActive ? activeIcon : icon}
              </IconButton>
            );
          })}
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 1 : 3,
          pb: isMobile ? "80px" : 3,
        }}
      >
        {" "}
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
