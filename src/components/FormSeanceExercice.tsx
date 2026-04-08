import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
	seanceId: number;
	exerciceId: number;
	onSuccess: () => void;
}

const SX_IN = {
	"& .MuiOutlinedInput-root": {
		background: "#111e2c",
		borderRadius: "6px",
		fontFamily: "'Barlow',sans-serif",
		fontSize: "0.88rem",
		color: "#e2e8f0",
		"& fieldset": { borderColor: "rgba(34,197,94,0.18)" },
		"&:hover fieldset": { borderColor: "rgba(34,197,94,0.4)" },
		"&.Mui-focused fieldset": { borderColor: "#22c55e" },
	},
	"& .MuiInputLabel-root": { color: "#7a8fa6", fontSize: "0.82rem" },
	"& .MuiInputLabel-root.Mui-focused": { color: "#22c55e" },
};

const SX_BTN = {
	background: "#22c55e",
	color: "#0b1520",
	fontFamily: "'Barlow Condensed',sans-serif",
	fontStyle: "italic",
	fontWeight: 700,
	fontSize: "0.85rem",
	textTransform: "uppercase" as const,
	px: "16px",
	py: "7px",
	borderRadius: "4px",
	"&:hover": { background: "#16a34a", transform: "translateY(-1px)" },
};

export default function FormSeanceExercice({
	seanceId,
	exerciceId,
	onSuccess,
}: Props) {
	const { token } = useAuth();
	const [form, setForm] = useState({
		series: 3,
		reps: 10,
		charge: 0,
		repos: 60,
		ordre: 1,
	});
	const [loading, setLoading] = useState(false);

	const handleSave = async () => {
		setLoading(true);
		try {
			await fetch("http://localhost:3310/api/seances_exercices", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					id_seance: seanceId,
					id_exercice: exerciceId,
					...form,
				}),
			});
			onSuccess();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				background: "rgba(15,27,39,0.85)",
				border: "1px solid rgba(34,197,94,0.13)",
				borderRadius: "12px",
				p: "32px",
				display: "flex",
				flexDirection: "column",
				gap: 3,
			}}
		>
			<Typography
				sx={{
					fontFamily: "'Barlow Condensed',sans-serif",
					fontStyle: "italic",
					fontWeight: 700,
					fontSize: "1.1rem",
					color: "#7a8fa6",
					textTransform: "uppercase",
				}}
			>
				Paramètres de l'exercice
			</Typography>
			<Box sx={{ display: "flex", gap: 2 }}>
				{(["series", "reps", "charge", "repos", "ordre"] as const).map(
					(field) => (
						<TextField
							key={field}
							label={field.charAt(0).toUpperCase() + field.slice(1)}
							type="number"
							value={form[field]}
							onChange={(e) =>
								setForm({ ...form, [field]: Number(e.target.value) })
							}
							sx={SX_IN}
						/>
					),
				)}
			</Box>
			<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
				<Button
					onClick={handleSave}
					disabled={loading}
					startIcon={<SaveIcon sx={{ fontSize: 15 }} />}
					sx={SX_BTN}
				>
					{loading ? "Enregistrement..." : "Confirmer l'exercice"}
				</Button>
			</Box>
		</Box>
	);
}
