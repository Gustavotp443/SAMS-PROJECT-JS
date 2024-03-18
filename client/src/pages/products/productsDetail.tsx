import { useNavigate, useParams } from "react-router-dom";
import { LayoutBasePage } from "../../shared/layouts";
import { DetailTolls } from "../../shared/components";
import { useEffect, useRef, useState } from "react";
import { productService } from "../../shared/services/api/products/productService";
import { Form } from "@unform/web";
import { VTextField } from "../../shared/forms";
import { FormHandles } from "@unform/core";

interface IFormData {
  user_id: number;
  name: string;
  price: number;
}

export const ProductsDetail: React.FC = () => {
  const { id = "novo" } = useParams<"id">();
  const navigate = useNavigate();

  const formRef = useRef<FormHandles>(null);

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
          console.log(result);
        }
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    dados.user_id = 1; //MUDAR USER ID

    if (id === "novo") {
      productService.create(dados);
    } else {
    }
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
          onClickSave={() => formRef.current?.submitForm()}
          onClickSaveAndBack={() => formRef.current?.submitForm()}
          onClickDelete={() => handleDelete(Number(id))}
          onClickGoBack={() => navigate("/produtos")}
          onClickNew={() => navigate("/produtos/detalhe/novo")}
        />
      }
    >
      <Form
        ref={formRef}
        onSubmit={handleSave}
        placeholder={"formulário de produto"}
      >
        <VTextField placeholder="Nome" name="name" />
        <VTextField placeholder="Valor" name="price" />
        <VTextField placeholder="Quantidade" name="quantity" />
      </Form>
    </LayoutBasePage>
  );
};
