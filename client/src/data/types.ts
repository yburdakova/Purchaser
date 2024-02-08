import { ReactElement } from "react";

interface ContactData {
  contactName: string;
  contactPhone: string;
}

export interface UserData {
  _id?: string;
  title?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
  isActive?: boolean;
  contacts?: ContactData[];
  extraInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  accessToken?: string
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
  forAdmin: boolean;
  data?: {
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
  products?: ProductData[];
  amount?: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerRequest {
  _id: string;
  title: string;
  email: string;
  contactName: string;
  contactPhone: string;
  type: 'newUser' | 'newPassword' | 'completed' | 'rejected';
  data?:{
    relatedId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserState {
  currentUser: UserData | null;
  isFetching: boolean;
  isAdmin: boolean;
  isActive: boolean;
  error: string | null;
  response: object | null;
}

export interface productStatsItem{
  categoryTitle: string;
  quantity: number;
}

export interface DashboardSlice {
  products: ProductData[],
  productStats: productStatsItem[],
}

export interface AdminState {
  customerRequests: CustomerRequest[],
  users: UserData[];
  orders: OrderData[];
  products: ProductData[];
  categories: CategoryData[];
  isFetching: boolean;
  error: string | null;
  response: UserData | ProductData | null;
}

export interface NotificationsState {
  notifyCounter: number,
  notifications: NotificationData[];
  focusedId: string;
  actualNotificationId: string;
  isFetching: boolean,
  error: string | null;
}

export interface OrderState {
  products: ProductData[],
  quantity: number,
  totalPrice: number,
  isOpen: boolean
}

export type SuccessAction<T> = (data: T) => { type: string; payload: T };

export interface ToggleStatusData {
  isActive: boolean;
}

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
  product: ProductData; 

  index: number;
  createdOrder?: boolean;
}

export interface CustomerItemProps{
  customer: UserData
}

export interface OrderItemAdmProps {
  order: OrderData;
  reloadOrders?: () => void 
}
export interface ProductItemProps {
  product: ProductData;
  focused?: boolean;
  reloadProducts?: () => void 
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