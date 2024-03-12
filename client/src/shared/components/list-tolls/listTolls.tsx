import { Box, Button, Icon, Paper, TextField, useTheme } from "@mui/material";
import React from "react";

interface IListTolls {
  textSearch?: string;
  showSearchInput?: boolean;
  onChangeSearchText?: (newText: string) => void;
  textNewButton?: string;
  showNewButton?: boolean;
  onClickNew?: () => void;
}

export const ListTolls: React.FC<IListTolls> = ({
  textSearch = "",
  showSearchInput = false,
  onChangeSearchText,
  textNewButton = "Novo",
  showNewButton = true,
  onClickNew
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
      {showSearchInput && (
        <TextField
          size="small"
          value={textSearch}
          onChange={e => onChangeSearchText?.(e.target.value)}
          placeholder="Pesquisar..."
        />
      )}
      <Box flex={1} display="flex" justifyContent="end">
        {showNewButton && (
          <Button
            color="primary"
            disableElevation
            variant="contained"
            endIcon={<Icon>add</Icon>}
          >
            {textNewButton}
          </Button>
        )}
      </Box>
    </Box>
  );
};
