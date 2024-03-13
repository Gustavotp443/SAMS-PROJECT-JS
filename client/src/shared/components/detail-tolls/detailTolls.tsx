import {
  Box,
  Button,
  Divider,
  Icon,
  Paper,
  Skeleton,
  useTheme
} from "@mui/material";

interface IDetailTollsProps {
  textNewButton?: string;

  showButtonNew?: boolean;
  showButtonGoBack?: boolean;
  showButtonDelete?: boolean;
  showButtonSave?: boolean;
  showButtonSaveAndBack?: boolean;

  showButtonNewLoading?: boolean;
  showButtonGoBackLoading?: boolean;
  showButtonDeleteLoading?: boolean;
  showButtonSaveLoading?: boolean;
  showButtonSaveAndBackLoading?: boolean;

  onClickNew?: () => void;
  onClickGoBack?: () => void;
  onClickDelete?: () => void;
  onClickSave?: () => void;
  onClickSaveAndBack?: () => void;
}
export const DetailTolls: React.FC<IDetailTollsProps> = ({
  textNewButton = "Novo",

  showButtonNew = true,
  showButtonGoBack = true,
  showButtonDelete = true,
  showButtonSave = true,
  showButtonSaveAndBack = false,

  showButtonNewLoading = false,
  showButtonGoBackLoading = false,
  showButtonDeleteLoading = false,
  showButtonSaveLoading = false,
  showButtonSaveAndBackLoading = false,

  onClickNew,
  onClickGoBack,
  onClickDelete,
  onClickSave,
  onClickSaveAndBack
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
      {showButtonSave && !showButtonSaveLoading && (
        <Button
          color="primary"
          disableElevation
          variant="contained"
          onClick={onClickSave}
          startIcon={<Icon>save</Icon>}
        >
          Salvar
        </Button>
      )}
      {showButtonSaveLoading && <Skeleton width={110} height={60} />}

      {showButtonSaveAndBack && !showButtonSaveAndBackLoading && (
        <Button
          color="primary"
          disableElevation
          variant="outlined"
          onClick={onClickSaveAndBack}
          startIcon={<Icon>save</Icon>}
        >
          Salvar e Voltar
        </Button>
      )}
      {showButtonSaveAndBackLoading && <Skeleton width={180} height={60} />}

      {showButtonDelete && !showButtonDeleteLoading && (
        <Button
          color="primary"
          disableElevation
          variant="outlined"
          onClick={onClickDelete}
          startIcon={<Icon>delete</Icon>}
        >
          Apagar
        </Button>
      )}
      {showButtonDeleteLoading && <Skeleton width={110} height={60} />}

      {showButtonNew && !showButtonNewLoading && (
        <Button
          color="primary"
          disableElevation
          variant="outlined"
          onClick={onClickNew}
          startIcon={<Icon>add</Icon>}
        >
          {textNewButton}
        </Button>
      )}
      {showButtonNewLoading && <Skeleton width={110} height={60} />}

      <Divider variant="middle" orientation="vertical" />

      {showButtonGoBack && !showButtonGoBackLoading && (
        <Button
          color="primary"
          disableElevation
          variant="outlined"
          onClick={onClickGoBack}
          startIcon={<Icon>arrow_back</Icon>}
        >
          Voltar
        </Button>
      )}
      {showButtonGoBackLoading && <Skeleton width={110} height={60} />}
    </Box>
  );
};
