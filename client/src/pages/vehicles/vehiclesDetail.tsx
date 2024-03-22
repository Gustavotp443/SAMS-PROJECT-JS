import { useNavigate, useParams } from "react-router-dom";
import { LayoutBasePage } from "../../shared/layouts";
import { DetailTolls } from "../../shared/components";
import { useEffect, useState } from "react";
import { VTextField, VForm, useVForm, IVFormErros } from "../../shared/forms";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography
} from "@mui/material";
import * as yup from "yup";
import {
  IListClient,
  clientService
} from "../../shared/services/api/clients/clientService";
import { vehicleService } from "../../shared/services/api/vehicles/vehiclesService";
import { vehiclesMakes } from "../../shared/utils/vehiclesMakes";

interface IFormData {
  client_id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  client_id: yup.number().required(),
  make: yup.string().required().max(100),
  model: yup.string().required().max(100),
  year: yup.number().required().min(1900).max(new Date().getFullYear()),
  license_plate: yup.string().required().max(20)
});

export const VehiclesDetail: React.FC = () => {
  const { id = "novo" } = useParams<"id">();
  const navigate = useNavigate();

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  const [clients, setClients] = useState<IListClient[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedMake, setSelectedMake] = useState("");

  useEffect(() => {
    clientService.getAll().then(result => {
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setClients(result.data || []);
      }
    });
  }, []);

  useEffect(() => {
    if (id !== "novo") {
      setIsLoading(true);
      vehicleService.getById(Number(id)).then(result => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate("/veiculos");
        } else {
          setName(result.model);
          setSelectedClient(result.client_id.toString());
          setSelectedMake(result.make);
          formRef.current?.setData(result);
        }
      });
    } else {
      formRef.current?.setData({
        client_id: "",
        make: "",
        model: "",
        year: "",
        license_plate: ""
      });
      setSelectedClient("");
      setSelectedMake("");
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    if (selectedClient === "") {
      alert("Cliente não selecionado!");
      return;
    } else dados.client_id = Number(selectedClient);

    dados.make = selectedMake;

    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then(dadosValidados => {
        setIsLoading(true);
        if (id === "novo") {
          vehicleService.create(dadosValidados).then(result => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/veiculos");
              } else {
                navigate(`/veiculos/detalhe/${result}`);
              }
            }
          });
        } else {
          vehicleService.updateById(Number(id), dadosValidados).then(result => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/veiculos");
              }
            }
          });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErros = {};
        errors.inner.forEach(error => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });
        formRef.current?.setErrors(validationErrors);
      });
  };

  const handleDelete = (id: number) => {
    if (confirm("Realmente deseja apagar?")) {
      vehicleService.deleteById(id).then(result => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert("Registro apagado com sucesso!");
          navigate("/veiculos");
        }
      });
    }
  };

  return (
    <LayoutBasePage
      titulo={id === "novo" ? "Novo veiculo" : name}
      barraDeFerramentas={
        <DetailTolls
          textNewButton="Novo"
          showButtonSaveAndBack
          showButtonNew={id !== "novo"}
          showButtonDelete={id !== "novo"}
          onClickSave={save}
          onClickSaveAndBack={saveAndClose}
          onClickDelete={() => handleDelete(Number(id))}
          onClickGoBack={() => navigate("/veiculos")}
          onClickNew={() => navigate("/veiculos/detalhe/novo")}
        />
      }
    >
      <VForm
        ref={formRef}
        onSubmit={handleSave}
        placeholder={"formulário de veiculos"}
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
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Modelo"
                  name="model"
                  disabled={isLoading}
                  onChange={e => setName(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <FormControl fullWidth>
                  <InputLabel>Marca</InputLabel>
                  <Select
                    label="Marca"
                    name="make"
                    value={selectedMake}
                    onChange={e => {
                      formRef.current?.setFieldValue("make", e.target.value);
                      setSelectedMake(e.target.value);
                    }}
                    disabled={isLoading}
                  >
                    {vehiclesMakes.map(make => (
                      <MenuItem key={make} value={make}>
                        {make}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Ano"
                  name="year"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Placa"
                  name="license_plate"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
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
          </Grid>
        </Box>
      </VForm>
    </LayoutBasePage>
  );
};
