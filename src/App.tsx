import './App.css'
import { AppRouter } from "./routes/AppRouter.tsx";
import { AuthProvider } from "./routes/AuthContext.tsx";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast.css';



function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {/*<ChatProvider>*/}
          <AppRouter />
        {/*</ChatProvider>*/}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App
