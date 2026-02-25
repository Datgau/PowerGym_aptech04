import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
console.log("App mounted");
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
  <StrictMode>
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);


// createRoot(rootElement).render(
//     <StrictMode>
//         <BrowserRouter>
//             <App />
//         </BrowserRouter>
//     </StrictMode>
// );