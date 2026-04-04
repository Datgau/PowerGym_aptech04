import './App.css'
import { AppRouter } from "./routes/AppRouter.tsx";
import { AuthProvider } from "./routes/AuthContext.tsx";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast.css';
import { AiChatPopup } from "./components/AiChat/AiChatPopup.tsx";



function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {/*<ChatProvider>*/}
          <AppRouter />
        {/*</ChatProvider>*/}
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
        {/* AI Chat Popup - Always visible */}
        <AiChatPopup />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App
