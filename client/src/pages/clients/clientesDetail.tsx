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
import { brazilStates, getUsertId } from "../../shared/utils";
import { clientService } from "../../shared/services/api/clients/clientService";

interface IFormData {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    code: string;
  };
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  user_id: yup.number().required(),
  name: yup.string().required().min(3),
  email: yup.string().required().email(),
  phone: yup
    .string()
    .required()
    .matches(/^\d{11}$/, "Phone must be 11 digits"),
  address: yup
    .object()
    .shape({
      street: yup.string().required(),
      city: yup.string().required(),
      state: yup.string().required(),
      code: yup
        .string()
        .required()
        .matches(/^\d{8}$/, "Code must be 8 digits")
    })
    .required()
});

export const ClientsDetail: React.FC = () => {
  const { id = "novo" } = useParams<"id">();
  const navigate = useNavigate();

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    if (id !== "novo") {
      setIsLoading(true);

      clientService.getById(Number(id)).then(result => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate("/clientes");
        } else {
          setName(result.name);
          setSelectedState(result.address.state);
          formRef.current?.setData(result);
        }
      });
    } else {
      formRef.current?.setData({
        user_id: getUsertId(),
        name: "",
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          code: ""
        }
      });
      setSelectedState("");
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    dados.user_id = getUsertId(); //USERID
    console.log(selectedState);
    dados.address.state = selectedState;
    console.log(dados);
    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then(dadosValidados => {
        setIsLoading(true);
        if (id === "novo") {
          clientService.create(dadosValidados).then(result => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/clientes");
              } else {
                navigate(`/clientes/detalhe/${result}`);
              }
            }
          });
        } else {
          clientService.updateById(Number(id), dadosValidados).then(result => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/clientes");
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
      clientService.deleteById(id).then(result => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert("Registro apagado com sucesso!");
          navigate("/clientes");
        }
      });
    }
  };

  return (
    <LayoutBasePage
      titulo={id === "novo" ? "Novo cliente" : name}
      barraDeFerramentas={
        <DetailTolls
          textNewButton="Novo"
          showButtonSaveAndBack
          showButtonNew={id !== "novo"}
          showButtonDelete={id !== "novo"}
          onClickSave={save}
          onClickSaveAndBack={saveAndClose}
          onClickDelete={() => handleDelete(Number(id))}
          onClickGoBack={() => navigate("/clientes")}
          onClickNew={() => navigate("/clientes/detalhe/novo")}
        />
      }
    >
      <VForm
        ref={formRef}
        onSubmit={handleSave}
        placeholder={"formulário de clientes"}
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
                  label="Nome"
                  name="name"
                  disabled={isLoading}
                  onChange={e => setName(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Email"
                  name="email"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Telefone"
                  name="phone"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Rua"
                  name="address.street"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Cidade"
                  name="address.city"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    label="Estado"
                    name="address.state"
                    value={selectedState}
                    onChange={e => {
                      formRef.current?.setFieldValue(
                        "address.state",
                        e.target.value
                      );
                      setSelectedState(e.target.value);
                    }}
                    disabled={isLoading}
                  >
                    {brazilStates.map(state => (
                      <MenuItem key={state.value} value={state.value}>
                        {state.label}
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
                  label="cep"
                  name="address.code"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm>
    </LayoutBasePage>
  );
};
