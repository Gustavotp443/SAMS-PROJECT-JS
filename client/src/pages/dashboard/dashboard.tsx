import { DetailTolls, ListTolls } from "../../shared/components";
import { LayoutBasePage } from "../../shared/layouts";

export const Dashboard = () => {
  return (
    <LayoutBasePage
      titulo="Página inicial"
      barraDeFerramentas={<DetailTolls />}
    >
      Testando
    </LayoutBasePage>
  );
};
