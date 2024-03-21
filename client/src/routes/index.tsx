import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";
import { Dashboard, ProductsDetail, ProductsList } from "../pages";
import { ClientList } from "../pages/clients/clientsList";
import { ClientsDetail } from "../pages/clients/clientesDetail";

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
      },
      {
        label: "Clientes",
        icon: "person-icon",
        path: "/clientes"
      }
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/inicio" element={<Dashboard />} />

      <Route path="/produtos" element={<ProductsList />} />
      <Route path="/produtos/detalhe/:id" element={<ProductsDetail />} />

      <Route path="/clientes" element={<ClientList />} />
      <Route path="/clientes/detalhe/:id" element={<ClientsDetail />} />

      <Route path="*" element={<Navigate to="/inicio" />} />
    </Routes>
  );
};
