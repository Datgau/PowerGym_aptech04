import './App.css'
import { AppRouter } from "./routes/AppRouter.tsx";
import { AuthProvider } from "./routes/AuthContext.tsx";
// import { ChatProvider } from "./contexts/ChatContext.tsx";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";



function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {/*<ChatProvider>*/}
          <AppRouter />
        {/*</ChatProvider>*/}
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App
