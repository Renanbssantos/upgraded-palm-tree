// Shape of a product returned by https://dummyjson.com/products
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
  images: string[];
}
