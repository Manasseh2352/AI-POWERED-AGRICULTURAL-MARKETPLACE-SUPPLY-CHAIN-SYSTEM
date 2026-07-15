import { apiFetch } from '@/lib/axios';

export const PaymentService = {
  initiatePayment: (data: any) => {
    return apiFetch('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
