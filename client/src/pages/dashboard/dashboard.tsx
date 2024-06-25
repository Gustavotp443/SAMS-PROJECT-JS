import { Card, CardMedia, Paper, Typography } from "@mui/material";
import { ListTolls } from "../../shared/components";
import { LayoutBasePage } from "../../shared/layouts";
import img from "./../../img/fundo2.png";

export const Dashboard = () => {
  return (
    <LayoutBasePage titulo="SAMS">
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h5" align="center">
          Olá, seja bem-vindo ao SAMS!
        </Typography>
        <Card
          sx={{
            maxWidth: 400,
            margin: "auto",
            top: "20px",
            position: "relative"
          }}
        >
          <CardMedia component="img" height="auto" image={img} />
        </Card>
      </Paper>
    </LayoutBasePage>
  );
};
