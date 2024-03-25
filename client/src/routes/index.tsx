import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";
import { Dashboard, ProductsDetail, ProductsList } from "../pages";
import { ClientList } from "../pages/clients/clientsList";
import { ClientsDetail } from "../pages/clients/clientesDetail";
import { VehiclesList } from "../pages/vehicles/vehiclesList";
import { VehiclesDetail } from "../pages/vehicles/vehiclesDetail";
import { EmployeeList } from "../pages/employees/employeesList";
import { EmployeeDetail } from "../pages/employees/employeesDetail";
import { ServiceOrderList } from "../pages/servicesOrder/serviceOrderList";
import { ServiceOrderDetail } from "../pages/servicesOrder/serviceOrderDetail";

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
      },
      {
        label: "Veiculos",
        icon: "garage",
        path: "/veiculos"
      },
      {
        label: "Funcionarios",
        icon: "badge",
        path: "/funcionarios"
      },
      {
        label: "Serviços",
        icon: "work",
        path: "/ordemservico"
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

      <Route path="/veiculos" element={<VehiclesList />} />
      <Route path="/veiculos/detalhe/:id" element={<VehiclesDetail />} />

      <Route path="/funcionarios" element={<EmployeeList />} />
      <Route path="/funcionarios/detalhe/:id" element={<EmployeeDetail />} />

      <Route path="/ordemservico" element={<ServiceOrderList />} />
      <Route
        path="/ordemservico/detalhe/:id"
        element={<ServiceOrderDetail />}
      />

      <Route path="*" element={<Navigate to="/inicio" />} />
    </Routes>
  );
};
