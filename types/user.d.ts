export interface extraUserData {
  apps: string[];
}

export interface User {
  _id: string;
  createdAt: Date;
  email: string;
  extraUserData: extraUserData;
  id: string;
  name: string;
  photo: URL;
  provider: string;
  role: 'ADMIN' | 'USER';
  updatedAt: Date;
}

export interface RWApplicationData {
  widgets?: Record<string, Record<string, string | number>>;
}
export interface ApplicationData {
  rw?: RWApplicationData;
}

export interface UserData {
  createdAt: Date;
  applicationData: ApplicationData;
}

export interface UserWithToken extends User {
  token: string;
}
