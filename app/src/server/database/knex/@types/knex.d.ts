import { IUser } from "../../models";

declare module "knex/types/tables" {
  interface Tables {
    users: IUser;
    products: IProduct;
    stock: IStock;
    address: IAddress;
    clients: IClient;
    // vehicles:IVehicle,
    // employees:IEmployees,
    // serviceOrders:IServiceOrder,
    // productItens:IProductItem
  }
}
