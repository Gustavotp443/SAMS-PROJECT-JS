import { useNavigate, useParams } from "react-router-dom";
import { LayoutBasePage } from "../../shared/layouts";
import { DetailTolls } from "../../shared/components";
import { useEffect, useState } from "react";
import { VTextField, VForm, useVForm, IVFormErros } from "../../shared/forms";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from "yup";
import { getUsertId } from "../../shared/utils";
import { employeeService } from "../../shared/services/api/employees/employeeService";

interface IFormData {
  user_id: number;
  name: string;
  email: string;
  phone: string;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  user_id: yup.number().required(),
  name: yup.string().required().min(3),
  email: yup.string().required().email(),
  phone: yup
    .string()
    .required()
    .matches(/^\d{11}$/, "Telefone deve ter 11 digitos")
});

export const EmployeeDetail: React.FC = () => {
  const { id = "novo" } = useParams<"id">();
  const navigate = useNavigate();

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (id !== "novo") {
      setIsLoading(true);

      employeeService.getById(Number(id)).then(result => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate("/funcionarios");
        } else {
          setName(result.name);
          formRef.current?.setData(result);
        }
      });
    } else {
      formRef.current?.setData({
        user_id: getUsertId(),
        name: "",
        email: "",
        phone: ""
      } as IFormData);
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    dados.user_id = getUsertId(); //USERID
    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then(dadosValidados => {
        setIsLoading(true);
        if (id === "novo") {
          employeeService.create(dadosValidados).then(result => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/funcionarios");
              } else {
                navigate(`/funcionarios/detalhe/${result}`);
              }
            }
          });
        } else {
          employeeService
            .updateById(Number(id), dadosValidados)
            .then(result => {
              setIsLoading(false);
              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate("/funcionarios");
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
      employeeService.deleteById(id).then(result => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert("Registro apagado com sucesso!");
          navigate("/funcionarios");
        }
      });
    }
  };

  return (
    <LayoutBasePage
      titulo={id === "novo" ? "Novo funcionário" : name}
      barraDeFerramentas={
        <DetailTolls
          textNewButton="Novo"
          showButtonSaveAndBack
          showButtonNew={id !== "novo"}
          showButtonDelete={id !== "novo"}
          onClickSave={save}
          onClickSaveAndBack={saveAndClose}
          onClickDelete={() => handleDelete(Number(id))}
          onClickGoBack={() => navigate("/funcionarios")}
          onClickNew={() => navigate("/funcionarios/detalhe/novo")}
        />
      }
    >
      <VForm
        ref={formRef}
        onSubmit={handleSave}
        placeholder={"formulário de funcionários"}
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
          </Grid>
        </Box>
      </VForm>
    </LayoutBasePage>
  );
};
