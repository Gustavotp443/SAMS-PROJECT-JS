import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";
import { Dashboard } from "../pages";

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
        label: "Funcionários",
        icon: "star",
        path: "/funcionarios"
      }
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/inicio" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/inicio" />} />
    </Routes>
  );
};
