import {
  Box,
  Icon,
  IconButton,
  Theme,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useDrawerContext } from "../contexts";
import { ReactNode } from "react";

interface ILayoutBasePage {
  titulo: string;
  barraDeFerramentas?: ReactNode;
  children?: React.ReactNode;
}

export const LayoutBasePage: React.FC<ILayoutBasePage> = ({
  children,
  titulo,
  barraDeFerramentas
}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm")); //600px
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("md")); //600px
  const theme = useTheme();

  const { toggleDrawerOpen } = useDrawerContext();

  return (
    <Box height="100%" display="flex" flexDirection="column" gap={1}>
      <Box
        padding={1}
        display="flex"
        alignItems="center"
        height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)}
        gap={1}
      >
        {smDown && (
          <IconButton onClick={toggleDrawerOpen}>
            <Icon>menu</Icon>
          </IconButton>
        )}
        <Typography
          variant={smDown ? "h5" : mdDown ? "h4" : "h3"}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {titulo}
        </Typography>
      </Box>
      {barraDeFerramentas && <Box>{barraDeFerramentas}</Box>}
      <Box flex={1} overflow="auto">
        {children}
      </Box>
    </Box>
  );
};
