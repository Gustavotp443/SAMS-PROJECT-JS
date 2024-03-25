import { useNavigate, useSearchParams } from "react-router-dom";
import { ListTolls } from "../../shared/components";
import { LayoutBasePage } from "../../shared/layouts";
import React, { useEffect, useMemo, useState } from "react";
import {
  IListProduct,
  productService
} from "../../shared/services/api/products/productService";
import { useDebounce } from "../../shared/hooks";
import {
  Button,
  Icon,
  IconButton,
  LinearProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow
} from "@mui/material";
import { enviromnent } from "../../shared/environment";
import {
  IListServiceOrder,
  serviceOrderService
} from "../../shared/services/api/serviceOrders/serviceOrders";
import {
  IDetailVehicle,
  vehicleService
} from "../../shared/services/api/vehicles/vehiclesService";
import {
  IDetailEmployee,
  employeeService
} from "../../shared/services/api/employees/employeeService";

export const ServiceOrderList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  interface IListServiceOrderWithExtraData extends IListServiceOrder {
    vehicleModel?: string;
    employeeName?: string;
    products?: IListProduct[];
    showProducts: boolean;
  }

  const [rows, setRows] = useState<IListServiceOrderWithExtraData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      serviceOrderService.getAll(pagina, busca).then(async result => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCount(result.totalCount);

          const updateRows = await Promise.all(
            result.data.map(async item => {
              let vehicleData: IDetailVehicle | Error | undefined;
              let employeeData: IDetailEmployee | Error | undefined;

              if (item.vehicle_id)
                vehicleData = await vehicleService.getById(item.vehicle_id);

              if (item.employee_id)
                employeeData = await employeeService.getById(item.employee_id);

              const products: IListProduct[] = [];
              for (const productItem of item.productItens) {
                const product = await productService.getById(
                  productItem.product_id
                );
                if (product && !(product instanceof Error)) {
                  const quantity = productItem.quantity;
                  const totalPrice = product.price * quantity;
                  const modifiedProduct = {
                    ...product,
                    price: totalPrice,
                    quantity
                  };
                  products.push(modifiedProduct);
                }
              }

              const vehicleModel =
                vehicleData !== undefined && !(vehicleData instanceof Error)
                  ? `${vehicleData.model} ${vehicleData.year}`
                  : undefined;

              const employeeName =
                employeeData !== undefined && !(employeeData instanceof Error)
                  ? employeeData.name
                  : undefined;

              return {
                ...item,
                vehicleModel,
                employeeName,
                products,
                showProducts: false
              };
            })
          );

          setRows(updateRows);
        }
      });
    });
  }, [busca, pagina]);

  const handleDelete = (id: number) => {
    if (confirm("Realmente deseja apagar?")) {
      serviceOrderService.deleteById(id).then(result => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setRows(oldRows => [...oldRows.filter(oldRow => oldRow.id !== id)]);
          alert("Registro apagado com sucesso!");
        }
      });
    }
  };

  const handleToggleProducts = (id: number) => {
    setRows(
      rows.map(row => {
        if (row.id === id) {
          return {
            ...row,
            showProducts: !row.showProducts
          };
        }
        return row;
      })
    );
  };

  return (
    <LayoutBasePage
      titulo="Listagem de ordem de serviços"
      barraDeFerramentas={
        <ListTolls
          showSearchInput
          textNewButton="Nova"
          textSearch={busca}
          onChangeSearchText={text =>
            setSearchParams({ busca: text, pagina: "1" }, { replace: true })
          }
          onClickNew={() => navigate("/ordemservico/detalhe/nova")}
        />
      }
    >
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ m: 1, width: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ações</TableCell>
              <TableCell>id</TableCell>
              <TableCell>veículo</TableCell>
              <TableCell>funcionário</TableCell>
              <TableCell>descrição</TableCell>
              <TableCell>produtos</TableCell>
              <TableCell>data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <React.Fragment key={row.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Icon>delete</Icon>
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigate(`/ordemservico/detalhe/${row.id}`)
                      }
                    >
                      <Icon>edit</Icon>
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    {row.vehicleModel !== undefined
                      ? row.vehicleModel
                      : "nenhum veículo"}
                  </TableCell>
                  <TableCell>
                    {row.employeeName !== undefined ? row.employeeName : ""}
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    {row.products !== undefined && row.products.length > 0 ? (
                      <Button onClick={() => handleToggleProducts(row.id)}>
                        {row.showProducts
                          ? "Esconder Produtos"
                          : "Mostrar Produtos"}
                      </Button>
                    ) : (
                      "nenhum produto"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(row.order_date).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
                {row.showProducts && row.products && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>nome</TableCell>
                            <TableCell>preço total</TableCell>
                            <TableCell>quantidade</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {row.products.map(product => (
                            <TableRow key={product.id}>
                              <TableCell>{product.id}</TableCell>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.price}</TableCell>
                              <TableCell>{product.quantity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>

          {totalCount === 0 && !isLoading && (
            <caption>{enviromnent.EMPTY_LIST}</caption>
          )}

          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>
                  <LinearProgress variant="indeterminate" />
                </TableCell>
              </TableRow>
            )}
            {totalCount > 0 && totalCount > enviromnent.LINE_LIMITS && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Pagination
                    page={pagina}
                    count={Math.ceil(totalCount / enviromnent.LINE_LIMITS)}
                    onChange={(_, newPage) =>
                      setSearchParams(
                        { busca, pagina: newPage.toString() },
                        { replace: true }
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBasePage>
  );
};
