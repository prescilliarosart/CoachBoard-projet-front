import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		mot_de_passe: "",
	});

	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:3310/api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (!response.ok) {
				throw new Error("Identifiants incorrects");
			}

			const { token } = await response.json();
			const loggedUser = login(token);

			if (!loggedUser) return;

			if (loggedUser.role === "coach") {
				navigate("/dashboard-coach");
			} else {
				navigate("/dashboard-eleves");
			}
		} catch (_err) {
			setError("Identifiants incorrects");
		}
	};
	return (
		<div
			style={{
				position: "relative",
				zIndex: 1,
				minHeight: "100vh",
				backgroundColor: "#0b1520",
			}}
		>
			<ProgressionCanvas />
			<Navbar links={[]} profilLabel="Connexion" />

			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
					position: "relative",
					zIndex: 2,
					px: 2,
				}}
			>
				<Box
					sx={{
						backgroundColor: "#1E293B",
						borderRadius: "12px",
						padding: "48px 40px",
						width: "100%",
						maxWidth: "440px",
						boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
					}}
				>
					<Typography
						variant="h4"
						sx={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontStyle: "italic",
							fontWeight: 700,
							color: "#fff",
							mb: 1,
						}}
					>
						CONNEXION
					</Typography>
					<Typography
						variant="body2"
						sx={{
							fontFamily: "'Barlow', sans-serif",
							color: "rgba(255,255,255,0.5)",
							mb: 4,
						}}
					>
						Accède à ton espace CoachBoard
					</Typography>

					<Box
						component="form"
						onSubmit={handleSubmit}
						sx={{ display: "flex", flexDirection: "column", gap: 2 }}
					>
						<TextField
							type="email"
							name="email"
							label="Adresse email"
							value={formData.email}
							onChange={handleChange}
							fullWidth
							required
							variant="outlined"
							slotProps={{
								inputLabel: {
									style: {
										color: "rgba(255,255,255,0.5)",
										backgroundColor: "#1E293B",
										paddingRight: "4px",
									},
								},
							}}
							sx={{
								"& .MuiOutlinedInput-root": {
									color: "#fff",
									"& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
									"&:hover fieldset": { borderColor: "#22c55e" },
									"&.Mui-focused fieldset": { borderColor: "#22c55e" },
								},
							}}
						/>
						<TextField
							type="password"
							name="mot_de_passe"
							label="Mot de passe"
							value={formData.mot_de_passe}
							onChange={handleChange}
							fullWidth
							required
							variant="outlined"
							slotProps={{
								inputLabel: {
									style: {
										color: "rgba(255,255,255,0.5)",
										backgroundColor: "#1E293B",
										paddingRight: "4px",
									},
								},
							}}
							sx={{
								"& .MuiOutlinedInput-root": {
									color: "#fff",
									"& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
									"&:hover fieldset": { borderColor: "#22c55e" },
									"&.Mui-focused fieldset": { borderColor: "#22c55e" },
								},
							}}
						/>

						<Box sx={{ minHeight: "24px" }}>
							{error && (
								<Typography color="error" variant="body2">
									{error}
								</Typography>
							)}
						</Box>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{
								backgroundColor: "#22c55e",
								color: "#0b1520",
								fontFamily: "'Barlow Condensed', sans-serif",
								fontStyle: "italic",
								fontSize: "1.1rem",
								fontWeight: 700,
								border: "1.5px solid #22c55e",
								borderRadius: "4px",
								py: 1.5,
								"&:hover": {
									backgroundColor: "#16a34a",
									transform: "translateY(-2px)",
									boxShadow: "0 8px 28px rgba(34, 197, 94, 0.22)",
								},
							}}
						>
							Se connecter
						</Button>
					</Box>
				</Box>
			</Box>
		</div>
	);
}

export default LoginPage;
