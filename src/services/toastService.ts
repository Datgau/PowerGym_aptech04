import { toast, ToastOptions } from 'react-toastify';

// Default toast options
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const toastService = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  },

  // Handle API error response
  apiError: (error: any) => {
    let message = 'An unexpected error occurred';

    if (error?.response?.data) {
      const errorData = error.response.data;
      
      // Backend error format: { success: false, message: "...", status: 400, errorCode: "..." }
      if (errorData.message) {
        message = errorData.message;
      } else if (typeof errorData === 'string') {
        message = errorData;
      } else if (errorData.error) {
        message = errorData.error;
      }
    } else if (error?.message) {
      message = error.message;
    }

    toast.error(message, { ...defaultOptions, autoClose: 5000 });
  },

  // Dismiss all toasts
  dismiss: () => {
    toast.dismiss();
  },

  // Dismiss specific toast by id
  dismissById: (id: string | number) => {
    toast.dismiss(id);
  },
};

export default toastService;
