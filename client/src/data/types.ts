
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

export interface customerRequest {
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
  customerRequests: customerRequest[],
  notifyCounter: number;
  isFetching: boolean;
  error: string | null;
}

export interface CustomInputProps {
  label: string;
  placeholder: string;
  required?: boolean;
  type: string;
  isMask?: boolean;
  getValue?: (value: string) => void;  
}

export interface MenuItemProps{
  title: string;
  path: string;
  icon: React.ReactNode;
}