import { useSearchParams } from "react-router-dom";
import { ListTolls } from "../../shared/components";
import { LayoutBasePage } from "../../shared/layouts";

export const ProductsList: React.FC = () => {
  const [] = useSearchParams();

  return (
    <LayoutBasePage
      titulo="Listagem de produtos"
      barraDeFerramentas={
        <ListTolls
          showSearchInput
          textNewButton="Novo"
          textSearch="Teste"
          onChangeSearchText={texto => console.log(texto)}
        />
      }
    ></LayoutBasePage>
  );
};
