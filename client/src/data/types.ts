
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

export interface UserState {
  currentUser: UserData | null;
  isFetching: boolean;
  isAdmin: boolean;
  isActive: boolean;
  error: boolean
}

export interface CustomInputProps {
  label: string;
  placeholder: string;
  required: boolean;
  type: string;
}