import { useNavigate, useParams } from "react-router-dom";
import { LayoutBasePage } from "../../shared/layouts";
import { DetailTolls } from "../../shared/components";
import { useEffect, useState } from "react";
import { VTextField, VForm, useVForm, IVFormErros } from "../../shared/forms";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from "@mui/material";
import * as yup from "yup";
import { getUsertId } from "../../shared/utils";
import { serviceOrderService } from "../../shared/services/api/serviceOrders/serviceOrders";
import {
  IListVehicle,
  vehicleService
} from "../../shared/services/api/vehicles/vehiclesService";
import {
  IListEmployee,
  employeeService
} from "../../shared/services/api/employees/employeeService";
import {
  IListProduct,
  productService
} from "../../shared/services/api/products/productService";
import {
  IListClient,
  clientService
} from "../../shared/services/api/clients/clientService";
import { productItensService } from "../../shared/services/api/productItens/productItens";

export interface IProductQuantity {
  product_id: number;
  quantity: number;
}

interface IFormData {
  vehicle_id?: number;
  employee_id: number;
  user_id: number;
  description: string;
  products?: IProductQuantity[];
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  vehicle_id: yup.number(),
  employee_id: yup.number().required(),
  user_id: yup.number().required(),
  description: yup.string().required(),
  products: yup.array().of(
    yup.object().shape({
      product_id: yup.number().required(),
      quantity: yup.number().required().min(0)
    })
  )
});

export const ServiceOrderDetail: React.FC = () => {
  const { id = "nova" } = useParams<"id">();
  const navigate = useNavigate();

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  const [clients, setClients] = useState<IListClient[]>([]);
  const [selectedClient, setSelectedClient] = useState("");

  const [vehicles, setVehicles] = useState<IListVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const [employees, setEmployees] = useState<IListEmployee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [products, setProducts] = useState<IListProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<IProductQuantity[]>(
    []
  );

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productError, setProductError] = useState<string>("");
  const [employeeError, setEmployeeError] = useState<string>("");

  const [productToBeDeleted, setProductToBeDeleted] = useState<number[]>([]);

  const clearProductError = () => {
    setProductError("");
  };

  //clientes
  useEffect(() => {
    clientService.getAll().then(result => {
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setClients(result.data || []);
      }
    });
  }, []);

  //veiculos
  useEffect(() => {
    vehicleService.getAll().then(result => {
      if (result instanceof Error) {
        alert(result.message);
      } else {
        let filteredVehicles = result.data;
        if (id === "nova") {
          filteredVehicles = result.data.filter(
            vehicle => vehicle.client_id === Number(selectedClient)
          );
        }

        setVehicles(filteredVehicles || []);
      }
    });
  }, [selectedClient]);

  //funcionários
  useEffect(() => {
    employeeService.getAll().then(result => {
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setEmployees(result.data || []);
      }
    });
  }, []);

  //produtos
  useEffect(() => {
    productService.getAll().then(result => {
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setProducts(result.data || []);
      }
    });
  }, []);

  useEffect(() => {
    if (id !== "nova") {
      setIsLoading(true);

      serviceOrderService.getById(Number(id)).then(result => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate("/ordemservico");
        } else {
          setName(`Ordem serviço ${result.id}`);
          setSelectedVehicle(
            result.vehicle_id ? result.vehicle_id.toString() : ""
          );
          setSelectedEmployee(
            result.employee_id ? result.employee_id.toString() : ""
          );

          const allProducts = result.productItens.map(item => {
            return {
              product_id: Number(item.product_id),
              quantity: Number(item.quantity)
            };
          });
          setSelectedProducts(allProducts);
          formRef.current?.setData({ description: result.description });
        }
      });
    } else {
      formRef.current?.setData({
        vehicle_id: "",
        employee_id: "",
        user_id: getUsertId(),
        description: "",
        products: []
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    if (!dados.description) {
      formRef.current?.setErrors({
        description: "A descrição é obrigatória"
      });
    }

    if (selectedEmployee === undefined || selectedEmployee === "") {
      setEmployeeError("Campo funcionário obrigatório");
    }

    if (
      selectedEmployee === undefined ||
      selectedEmployee === "" ||
      !dados.description
    )
      return;

    if (selectedVehicle === "" && selectedProducts.length === 0) {
      alert(
        "É necessário selecionar um veículo ou adicionar produtos antes de salvar."
      );
      return;
    }

    const dadosFormatados = {
      vehicle_id: selectedVehicle ? Number(selectedVehicle) : undefined,
      employee_id: selectedEmployee,
      user_id: getUsertId(),
      description: dados.description,
      products: selectedProducts
    };

    formValidationSchema
      .validate(dadosFormatados, { abortEarly: false })
      .then(dadosValidados => {
        setIsLoading(true);
        if (id === "nova") {
          serviceOrderService.create(dadosValidados).then(result => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/ordemservico");
              } else {
                navigate(`/ordemservico/detalhe/${result}`);
              }
            }
          });
        } else {
          productToBeDeleted.map(async p => {
            await productItensService.deleteByProductId(p, Number(id));
          });
          serviceOrderService
            .updateById(Number(id), dadosValidados)
            .then(result => {
              setIsLoading(false);
              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate("/ordemservico");
                }
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErros = {};
        errors.inner.forEach(error => {
          console.log(error);
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });
        formRef.current?.setErrors(validationErrors);
      });
  };

  const handleDelete = (id: number) => {
    if (confirm("Realmente deseja apagar?")) {
      serviceOrderService.deleteById(id).then(result => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert("Registro apagado com sucesso!");
          navigate("/ordemservico");
        }
      });
    }
  };

  const handleAddProduct = () => {
    if (selectedProduct && Number(quantity) > 0) {
      const existingProductIndex = selectedProducts.findIndex(
        product => product.product_id === Number(selectedProduct)
      );

      if (existingProductIndex !== -1) {
        const updatedSelectedProducts = [...selectedProducts];
        updatedSelectedProducts[existingProductIndex].quantity =
          Number(quantity);
        setSelectedProducts(updatedSelectedProducts);
        setQuantity("");
        setSelectedProduct("");
        setIsEditingProduct(false);
        return;
      }

      setSelectedProducts([
        ...selectedProducts,
        { product_id: Number(selectedProduct), quantity: Number(quantity) }
      ]);
      setQuantity("");
      setIsEditingProduct(false);
      setSelectedProduct("");
      clearProductError();
    } else if (Number(quantity) <= 0)
      setProductError("Quantidade do produto deve ser maior que 0");
  };

  const handleDeleteProduct = async (index: number, productId: number) => {
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts.splice(index, 1);
    setSelectedProducts(updatedSelectedProducts);

    if (id !== "nova") {
      setProductToBeDeleted(prevState => [...prevState, productId]);
    }
  };

  return (
    <LayoutBasePage
      titulo={id === "nova" ? "Nova ordem de serviço" : name}
      barraDeFerramentas={
        <DetailTolls
          textNewButton="Nova"
          showButtonSaveAndBack
          showButtonNew={id !== "nova"}
          showButtonDelete={id !== "nova"}
          onClickSave={save}
          onClickSaveAndBack={saveAndClose}
          onClickDelete={() => handleDelete(Number(id))}
          onClickGoBack={() => navigate("/ordemservico")}
          onClickNew={() => navigate("/ordemservico/detalhe/nova")}
        />
      }
    >
      <VForm
        ref={formRef}
        onSubmit={handleSave}
        placeholder={"formulário de ordem de serviço"}
      >
        <Box
          margin={1}
          display="flex"
          flexDirection="column"
          component={Paper}
          variant="outlined"
        >
          <Grid container direction="column" padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant="indeterminate" />
              </Grid>
            )}
            <Grid item>
              <Typography variant="h6">Geral</Typography>
            </Grid>
            {id === "nova" && (
              <Grid container item direction="row">
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <FormControl fullWidth>
                    <InputLabel>Cliente</InputLabel>
                    <Select
                      label="Cliente"
                      name="client_id"
                      value={selectedClient}
                      onChange={e => {
                        formRef.current?.setFieldValue(
                          "client_id",
                          e.target.value
                        );
                        setSelectedClient(e.target.value);
                      }}
                      disabled={isLoading}
                    >
                      {clients.length > 0 ? (
                        clients.map(client => (
                          <MenuItem key={client.id} value={client.id}>
                            {client.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled value="">
                          Nenhum cliente disponível
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <FormControl fullWidth>
                  <InputLabel>Veículos</InputLabel>
                  <Select
                    label="Veículo"
                    name="vehicle_id"
                    value={selectedVehicle}
                    onChange={e => {
                      formRef.current?.setFieldValue(
                        "vehicle_id",
                        e.target.value
                      );
                      setSelectedVehicle(e.target.value);
                    }}
                    disabled={isLoading || id !== "nova"}
                  >
                    {vehicles.length > 0 ? (
                      vehicles.map(vehicle => (
                        <MenuItem key={vehicle.id} value={vehicle.id}>
                          {`${vehicle.model} ${vehicle.year}`}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        {selectedClient === ""
                          ? "Selecione um cliente"
                          : "Nenhum veículo disponível"}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <FormControl fullWidth>
                  <InputLabel>Funcionários</InputLabel>
                  <Select
                    label="Funcionário"
                    name="employee_id"
                    value={selectedEmployee}
                    onChange={e => {
                      formRef.current?.setFieldValue(
                        "employee_id",
                        e.target.value
                      );
                      setSelectedEmployee(e.target.value);
                    }}
                    disabled={isLoading}
                  >
                    {employees.length > 0 ? (
                      employees.map(employee => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        Nenhum funcionário disponível
                      </MenuItem>
                    )}
                  </Select>
                  {employeeError && (
                    <Typography variant="body2" color="error" padding={1}>
                      {employeeError}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Descrição"
                  name="description"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row" gap={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <FormControl fullWidth>
                  <InputLabel>Produtos</InputLabel>
                  <Select
                    disabled={isLoading || isEditingProduct}
                    value={selectedProduct}
                    onChange={e => {
                      setSelectedProduct(e.target.value);
                    }}
                  >
                    {products.map(product => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {productError && (
                    <Typography variant="body2" color="error" padding={1}>
                      {productError}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid container item direction="row">
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <TextField
                    fullWidth
                    value={quantity}
                    label="Quantidade"
                    disabled={isLoading}
                    onChange={e => setQuantity(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid item>
                <Button onClick={handleAddProduct}>Adicionar Produto</Button>
              </Grid>
              <Grid container item direction="column">
                <Typography variant="h6">Produtos Selecionados:</Typography>
                <List>
                  {selectedProducts.length > 0 ? (
                    selectedProducts.map((productQuantity, index) => (
                      <ListItem key={index}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <ListItemText
                            primary={
                              products.find(
                                product =>
                                  product.id === productQuantity.product_id
                              )?.name
                            }
                            secondary={`Quantidade: ${productQuantity.quantity}`}
                          />
                          <ListItemText
                            sx={{ marginTop: "-5px" }}
                            secondary={
                              <Box display="flex" alignItems="center">
                                <Button
                                  onClick={() => {
                                    setIsEditingProduct(true);
                                    setSelectedProduct(
                                      productQuantity.product_id.toString()
                                    );
                                    setQuantity(
                                      productQuantity.quantity.toString()
                                    );
                                  }}
                                >
                                  Editar
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleDeleteProduct(
                                      index,
                                      productQuantity.product_id
                                    )
                                  }
                                >
                                  Excluir
                                </Button>
                              </Box>
                            }
                          />
                        </div>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="Nenhum produto selecionado" />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm>
    </LayoutBasePage>
  );
};
