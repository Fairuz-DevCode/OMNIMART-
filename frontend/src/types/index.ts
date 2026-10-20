export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  badge?: string;
  description: string;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  discountTag: string;
  buttonText: string;
  bgGradient: string[];
  imageUrl: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  CatalogTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};
