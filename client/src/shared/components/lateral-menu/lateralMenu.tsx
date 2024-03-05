import React from "react";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { Inbox } from "@mui/icons-material";
interface ILateralMenuProps {
  children?: React.ReactNode;
}

function stringAvatar(name: string) {
  const nameParts = name.split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : `${nameParts[0][0]}`;
  return {
    children: initials
  };
}

export const LateralMenu: React.FC<ILateralMenuProps> = ({ children }) => {
  const theme = useTheme();
  return (
    <>
      <Drawer variant="permanent">
        <Box
          width={theme.spacing(28)}
          height="100%"
          display="flex"
          flexDirection="column"
        >
          <Box
            width="100%"
            height={theme.spacing(20)}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              {...stringAvatar("Gustavo Pardini")}
              alt="icone para perfil"
              sx={{
                height: theme.spacing(7),
                width: theme.spacing(7),
                bgcolor: deepPurple[500]
              }}
            />
            <h3>Gustavo</h3>
          </Box>
          <Divider />
          <Box flex={1}>
            <List component="nav">
              <ListItemButton>
                <ListItemIcon>
                  <Inbox />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Drawer>
      <Box height="100vh" marginLeft={theme.spacing(28)}>
        {children}
      </Box>
    </>
  );
};
