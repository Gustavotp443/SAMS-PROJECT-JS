import { useNavigate, useSearchParams } from "react-router-dom";
import { ListTolls } from "../../shared/components";
import { LayoutBasePage } from "../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../shared/hooks";
import {
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
  IListVehicle,
  vehicleService
} from "../../shared/services/api/vehicles/vehiclesService";
import { clientService } from "../../shared/services/api/clients/clientService";

interface IListVehicleWithClient extends IListVehicle {
  client: string;
}

export const VehiclesList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListVehicleWithClient[]>([]);
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
      vehicleService.getAll(pagina, busca).then(async result => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCount(result.totalCount);

          const updatedRows = await Promise.all(
            result.data.map(async item => {
              const clientData = await clientService.getById(item.client_id);
              return {
                ...item,
                client: clientData.name
              };
            })
          );

          setRows(updatedRows);
        }
      });
    });
  }, [busca, pagina]);

  const handleDelete = (id: number) => {
    if (confirm("Realmente deseja apagar?")) {
      vehicleService.deleteById(id).then(result => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setRows(oldRows => [...oldRows.filter(oldRow => oldRow.id !== id)]);
          alert("Registro apagado com sucesso!");
        }
      });
    }
  };
  return (
    <LayoutBasePage
      titulo="Listagem de veiculos"
      barraDeFerramentas={
        <ListTolls
          showSearchInput
          textNewButton="Novo"
          textSearch={busca}
          onChangeSearchText={text =>
            setSearchParams({ busca: text, pagina: "1" }, { replace: true })
          }
          onClickNew={() => navigate("/veiculos/detalhe/novo")}
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
              <TableCell>marca</TableCell>
              <TableCell>modelo</TableCell>
              <TableCell>ano</TableCell>
              <TableCell>placa</TableCell>
              <TableCell>cliente</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <IconButton size="small" onClick={() => handleDelete(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/veiculos/detalhe/${row.id}`)}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.make}</TableCell>
                <TableCell>{row.model}</TableCell>
                <TableCell>{row.year}</TableCell>
                <TableCell>{row.license_plate}</TableCell>
                <TableCell>{row.client}</TableCell>
              </TableRow>
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
