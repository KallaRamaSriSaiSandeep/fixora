export interface User {
  id: number;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'SERVICEPROVIDER';
  phone?: string;
  location?: string;
}

export interface ServiceProvider extends User {
  services: string[];
  fare: number;
  description: string;
  rating: number;
  completedJobs: number;
}

export interface Booking {
  id: number;
  customerId: number;
  serviceProviderId: number;
  serviceType: string;
  description: string;
  scheduledDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  customerName: string;
  providerName: string;
  fare: number;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'SERVICEPROVIDER';
  phone?: string;
  location?: string;
  services?: string[];
  fare?: number;
  description?: string;
}