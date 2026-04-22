import { Alert, Snackbar } from "@mui/material";
import { createContext, useContext, useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextValue {
	showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [type, setType] = useState<ToastType>("success");

	const showToast = (msg: string, t: ToastType = "success") => {
		setMessage(msg);
		setType(t);
		setOpen(true);
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={() => setOpen(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setOpen(false)}
					severity={type}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used inside ToastProvider");
	return ctx;
}
