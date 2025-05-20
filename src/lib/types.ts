export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  dataAiHint?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Profile = {
  id: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};
