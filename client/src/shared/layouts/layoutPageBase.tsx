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

interface ILayoutBasePage {
  titulo: string;
  children?: React.ReactNode;
}

export const LayoutBasePage: React.FC<ILayoutBasePage> = ({
  children,
  titulo
}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm")); //600px
  const theme = useTheme();

  const { toggleDrawerOpen } = useDrawerContext();

  return (
    <Box height="100%" display="flex" flexDirection="column" gap={1}>
      <Box
        padding={1}
        display="flex"
        alignItems="center"
        height={theme.spacing(12)}
        gap={1}
      >
        {smDown && (
          <IconButton onClick={toggleDrawerOpen}>
            <Icon>menu</Icon>
          </IconButton>
        )}
        <Typography variant="h5">{titulo}</Typography>
      </Box>
      <Box>Barra de ferramentas</Box>
      <Box>{children}</Box>
    </Box>
  );
};
