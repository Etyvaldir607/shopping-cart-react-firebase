import { IProduct } from "./product.interface";

export interface IOrder {
  Id?:                number;
  Cod?:               string;
  TotalPrice?:        number;
}

export interface IOrderProduct {
  Id?:                number;
  OrderId?:           string;
  PoductId?:          number;
  Amount?:            number; // cantidad
}
