
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
