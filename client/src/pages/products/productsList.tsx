import { useSearchParams } from "react-router-dom";
import { ListTolls } from "../../shared/components";
import { LayoutBasePage } from "../../shared/layouts";
import { useEffect, useMemo } from "react";
import { productService } from "../../shared/services/api/products/productService";
import { useDebounce } from "../../shared/hooks";

export const ProductsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce(3000);

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  useEffect(() => {
    debounce(() => {
      productService.getAll(1, busca).then(result => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log(result);
        }
      });
    });
  }, [busca]);

  return (
    <LayoutBasePage
      titulo="Listagem de produtos"
      barraDeFerramentas={
        <ListTolls
          showSearchInput
          textNewButton="Novo"
          textSearch={busca}
          onChangeSearchText={text =>
            setSearchParams({ busca: text }, { replace: true })
          }
        />
      }
    ></LayoutBasePage>
  );
};
