import { toast } from 'react-toastify';

export const message = {
  success: (content: string, duration: number = 3000) => {
    toast.success(content, {
      autoClose: duration,
      position: "top-right",
    });
  },
  
  error: (content: string, duration: number = 3000) => {
    toast.error(content, {
      autoClose: duration,
      position: "top-right",
    });
  },
  
  warning: (content: string, duration: number = 3000) => {
    toast.warning(content, {
      autoClose: duration,
      position: "top-right",
    });
  },
  
  info: (content: string, duration: number = 3000) => {
    toast.info(content, {
      autoClose: duration,
      position: "top-right",
    });
  }
};