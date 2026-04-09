import { AppRouter } from "./routes/AppRouter.tsx";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast.css';
import { AiChatPopup } from "./components/AiChat/AiChatPopup.tsx";
import { CartProvider } from "./context/CartContext.tsx";

function App() {
  return (
      <ErrorBoundary>
        <CartProvider>
          <AppRouter />
        </CartProvider>

        <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />

        <AiChatPopup />
      </ErrorBoundary>
  );
}

export default App;