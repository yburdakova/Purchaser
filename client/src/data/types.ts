import { ReactElement } from "react";

export interface UserData {
  _id?: string;
  username?: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  accessToken?: string
}

export interface CustomerData {
  _id?: string;
  title?: string;
  email: string;
  contactName?: string;
  contactPhone: string;
  extraInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryData {
  _id?: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationData {
  _id: string;
  toUser: string;
  fromUser: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  data: {
    requestId: string;
  };
  createdAt: Date;
}
interface HisoryPrice {
    price: number;
    date?: Date;
}
export interface ProductData {
  _id?: string;
  customId? : string;
  title: string;
  description?: string;
  category: string;
  measure: string;
  price: number;
  quantity: number;
  priceHistory: HisoryPrice[]
  createdAt?: Date;
  updatedAt?: Date;
}
export interface InputRefs {
  [key: string]: HTMLInputElement | null;
}

export interface OrderData {
  _id?: string;
  userId? : string;
  products: ProductData[];
  amount: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerRequest {
  _id?: string;
  name?: string;
  email: string;
  phone: string;
  isProcessed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserState {
  currentUser: UserData | null;
  isFetching: boolean;
  isAdmin: boolean;
  isActive: boolean;
  error: string | null;
}

export interface AdminState {
  customerRequests: CustomerRequest[],
  users: UserData[];
  products: ProductData[];
  categories: CategoryData[];
  notifications: NotificationData[];
  customers: CustomerData[];
  notifyCounter: number;
  focusedId: string;
  isFetching: boolean;
  error: string | null;
}

export interface OrderState {
  products: ProductData[],
  quantity: number,
  totalPrice: number,
  isOpen: boolean
}

export type SuccessAction<T> = (data: T) => { type: string; payload: T };

export interface CustomInputProps {
  label: string;
  placeholder: string;
  required?: boolean;
  type: string;
  isMask?: boolean;
  getValue?: (value: string) => void;  
  valueProps?: string;
  dark?: boolean;
}

export interface OrderListItemProps {
  product: ProductData, 
  index: number;
  createdOrder?: boolean;
}

export interface ProductItemProps {
  product: ProductData;
}
export interface MenuItemProps{
  title: string;
  path: string;
  icon: React.ReactNode;
}

export interface TableRowProps {
  rowData: ProductData
}

export interface OrderItemProps {
  order: OrderData;
}

export interface NotificationTitleMap {
  [key: string]: {
    title: string;
    icon: ReactElement;
  };
}

export type NotificationType = 
  'customerRequest' | 
  'newOrder' | 
  'newProduct' | 
  'priceChange' | 
  'statusChange' | 
  'orderStatusChange';