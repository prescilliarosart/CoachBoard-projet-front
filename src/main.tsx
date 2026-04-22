import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

const theme = createTheme({
	palette: {
		warning: {
			main: "#22c55e",
			contrastText: "#0b1520",
		},
	},
});

const root = document.getElementById("root");
if (root) {
	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<AuthProvider>
						<App />
					</AuthProvider>
				</ThemeProvider>
			</BrowserRouter>
		</React.StrictMode>,
	);
}
