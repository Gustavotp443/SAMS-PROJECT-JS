import { useNavigate, useParams } from "react-router-dom";
import { LayoutBasePage } from "../../shared/layouts";
import { DetailTolls } from "../../shared/components";
import { useEffect, useState } from "react";
import { productService } from "../../shared/services/api/products/productService";
import { VTextField, VForm, useVForm } from "../../shared/forms";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from "yup";

interface IFormData {
  user_id: number;
  name: string;
  price: number;
  quantity?: number;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  user_id: yup.number().required(),
  name: yup.string().required().min(3),
  price: yup.number().required(),
  quantity: yup.number().optional().moreThan(0)
});

export const ProductsDetail: React.FC = () => {
  const { id = "novo" } = useParams<"id">();
  const navigate = useNavigate();

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (id !== "novo") {
      setIsLoading(true);

      productService.getById(Number(id)).then(result => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate("/produtos");
        } else {
          setName(result.name);
          formRef.current?.setData(result);
        }
      });
    } else {
      formRef.current?.setData({
        user_id: 1,
        name: "",
        price: "",
        quantity: ""
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    dados.user_id = 1; //USERID
    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then(dadosValidados => {
        setIsLoading(true);
        if (id === "novo") {
          productService.create(dadosValidados).then(result => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/produtos");
              } else {
                navigate(`/produtos/detalhe/${result}`);
              }
            }
          });
        } else {
          productService.updateById(Number(id), dadosValidados).then(result => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/produtos");
              }
            }
          });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: { [key: string]: string } = {};
        errors.inner.forEach(error => {
          if (!error.path) return;
        });
        console.log(errors.inner);
      });
  };

  const handleDelete = (id: number) => {
    if (confirm("Realmente deseja apagar?")) {
      productService.deleteById(id).then(result => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert("Registro apagado com sucesso!");
          navigate("/produtos");
        }
      });
    }
  };

  return (
    <LayoutBasePage
      titulo={id === "novo" ? "Novo produto" : name}
      barraDeFerramentas={
        <DetailTolls
          textNewButton="Novo"
          showButtonSaveAndBack
          showButtonNew={id !== "novo"}
          showButtonDelete={id !== "novo"}
          onClickSave={save}
          onClickSaveAndBack={saveAndClose}
          onClickDelete={() => handleDelete(Number(id))}
          onClickGoBack={() => navigate("/produtos")}
          onClickNew={() => navigate("/produtos/detalhe/novo")}
        />
      }
    >
      <VForm
        ref={formRef}
        onSubmit={handleSave}
        placeholder={"formulário de produto"}
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
                  label="Valor"
                  name="price"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Quantidade"
                  name="quantity"
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
