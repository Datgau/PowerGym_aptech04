import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./styles/tiptap.css";
import App from "./App.tsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {AuthProvider} from "./routes/AuthContext.tsx";
import ScrollToTop from "./until/ScrollToTop.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const theme = createTheme({
    typography: {
        fontFamily: `'Inter', 'Be Vietnam Pro', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        h4: {
            fontWeight: 700,
            textTransform: 'uppercase',
        },
    },
});

createRoot(rootElement).render(
  <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);