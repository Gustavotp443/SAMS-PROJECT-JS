import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";
import { Dashboard, ProductsList } from "../pages";

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
      {/* <Route path="/produto/detalhe/:id" element={<Dashboard />} /> */}

      <Route path="*" element={<Navigate to="/inicio" />} />
    </Routes>
  );
};
