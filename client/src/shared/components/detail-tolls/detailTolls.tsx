import { Box, Button, Divider, Icon, Paper, useTheme } from "@mui/material";

interface IDetailTollsProps {
  textNewButton?: string;

  showButtonNew?: boolean;
  showButtonGoBack?: boolean;
  showButtonDelete?: boolean;
  showButtonSave?: boolean;
  showButtonSaveAndClose?: boolean;

  onClickNew?: () => void;
  onClickGoBack?: () => void;
  onClickDelete?: () => void;
  onClickSave?: () => void;
  onClickSaveAndClose?: () => void;
}
export const DetailTolls: React.FC<IDetailTollsProps> = ({
  textNewButton = "Novo",

  showButtonNew = true,
  showButtonGoBack = true,
  showButtonDelete = true,
  showButtonSave = true,
  showButtonSaveAndClose = true,

  onClickNew,
  onClickGoBack,
  onClickDelete,
  onClickSave,
  onClickSaveAndClose
}) => {
  const theme = useTheme();
  return (
    <Box
      gap={1}
      height={theme.spacing(5)}
      marginX={1}
      padding={1}
      paddingX={2}
      display={"flex"}
      alignItems={"center"}
      component={Paper}
    >
      <Button
        color="primary"
        disableElevation
        variant="contained"
        startIcon={<Icon>save</Icon>}
      >
        Salvar
      </Button>
      <Button
        color="primary"
        disableElevation
        variant="outlined"
        startIcon={<Icon>save</Icon>}
      >
        Salvar e Voltar
      </Button>
      <Button
        color="primary"
        disableElevation
        variant="outlined"
        startIcon={<Icon>delete</Icon>}
      >
        Apagar
      </Button>
      <Button
        color="primary"
        disableElevation
        variant="outlined"
        startIcon={<Icon>add</Icon>}
      >
        Novo
      </Button>

      <Divider variant="middle" orientation="vertical" />

      <Button
        color="primary"
        disableElevation
        variant="outlined"
        startIcon={<Icon>arrow_back</Icon>}
      >
        Voltar
      </Button>
    </Box>
  );
};
