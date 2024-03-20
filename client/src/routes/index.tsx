import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";
import { Dashboard, ProductsDetail, ProductsList } from "../pages";
import { Register } from "../shared/components/login/register";

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        label: "Página inicial",
        icon: "home",
        path: "/inicio"
      },
      {
        label: "Produtos",
        icon: "inventory-icon",
        path: "/produtos"
      }
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/inicio" element={<Dashboard />} />

      <Route path="/produtos" element={<ProductsList />} />
      <Route path="/produtos/detalhe/:id" element={<ProductsDetail />} />

      <Route path="*" element={<Navigate to="/inicio" />} />
    </Routes>
  );
};
