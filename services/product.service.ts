import { apiFetch } from '@/lib/axios';

export const ProductService = {
  getAllProducts: () => {
    return apiFetch('/products');
  },

  getProductById: (id: string) => {
    return apiFetch(`/products/${id}`);
  },

  getProductsByFarmer: (farmerId: string) => {
    // Current backend doesn't have a direct query param filter or separate endpoint for this, 
    // it just returns all products, but we can filter it client side, or if we 
    // update backend we'd pass it. For now, fetch all and filter.
    return apiFetch('/products').then((products: any[]) => 
      products.filter(p => p.farmerId === farmerId)
    );
  }
};
