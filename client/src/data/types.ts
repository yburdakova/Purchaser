
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

export interface CategoryData {
  _id?: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  priceHistory: HisoryPrice[]
  createdAt?: Date;
  updatedAt?: Date;
}
export interface InputRefs {
  [key: string]: HTMLInputElement | null;
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
  notifyCounter: number;
  isFetching: boolean;
  error: string | null;
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

export interface MenuItemProps{
  title: string;
  path: string;
  icon: React.ReactNode;
}

export interface TableRowProps {
  rowData: ProductData
}