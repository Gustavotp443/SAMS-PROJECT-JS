import { ListTolls } from "../../shared/components";
import { LayoutBasePage } from "../../shared/layouts";

export const Dashboard = () => {
  return (
    <LayoutBasePage
      titulo="SAMS"
      barraDeFerramentas={<ListTolls showNewButton={false} />}
    ></LayoutBasePage>
  );
};
