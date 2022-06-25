import { User } from "@furnitura/users";
import { OrderItem } from "./order-item";

export class Order 
{
    _id?:                string;
    orderItems?:        OrderItem[];
    shippingAddress1?:  string;
    shippingAddress2?:  string;
    city?:              string;
    zip?:               string;
    country?:           string;
    phone?:             string;
    status?:            number;
    totalPrice?:        string;
    user?:              any;   //we get a User Object, but we post a User id
    dateOrdered?:       string;
}