import { IProduct } from "./product.interface";

export interface IOrder {
  Id?:                string | number;
  UserId?:            number;
  Cod?:               string;
  TotalPrice?:        number;
}

export interface IOrderProduct {
  Id?:                string | number;
  OrderId?:           string;
  PoductId?:          number;
  Amount?:            number; // cantidad
}
