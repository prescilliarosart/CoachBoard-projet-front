import SaveIcon from "@mui/icons-material/Save";
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Exercice {
	ID_EXERCICE: number;
	NOM: string;
	CATEGORIE: string;
	MUSCLE_CIBLE: string;
}

interface Props {
	onSuccess: (exerciceId: number) => void;
}

const SX_SEL = {
	background: "#111e2c",
	color: "#e2e8f0",
	fontFamily: "'Barlow',sans-serif",
	fontSize: "0.88rem",
	borderRadius: "6px",
	"& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(34,197,94,0.18)" },
	"&:hover .MuiOutlinedInput-notchedOutline": {
		borderColor: "rgba(34,197,94,0.4)",
	},
	"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#22c55e" },
	"& .MuiSvgIcon-root": { color: "#7a8fa6" },
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
	transition: "all 0.2s",
	"&:hover": {
		background: "#16a34a",
		transform: "translateY(-1px)",
		boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
	},
};

export default function SelectExercice({ onSuccess }: Props) {
	const { token } = useAuth();
	const [exercices, setExercices] = useState<Exercice[]>([]);
	const [selectedId, setSelectedId] = useState<number | "">("");

	useEffect(() => {
		fetch("http://localhost:3310/api/exercices", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then(setExercices)
			.catch((err) => console.error("Erreur chargement exercices :", err));
	}, [token]);

	const handleConfirm = () => {
		if (!selectedId) {
			alert("Veuillez sélectionner un exercice.");
			return;
		}
		onSuccess(selectedId);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 3,
				background: "rgba(15,27,39,0.85)",
				border: "1px solid rgba(34,197,94,0.13)",
				borderRadius: "12px",
				p: "32px",
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
				Sélectionner un exercice
			</Typography>

			<FormControl fullWidth>
				<InputLabel
					sx={{
						color: "#7a8fa6",
						fontSize: "0.82rem",
						"&.Mui-focused": { color: "#22c55e" },
					}}
				>
					Exercice
				</InputLabel>
				<Select
					value={selectedId}
					label="Exercice"
					onChange={(e) => setSelectedId(e.target.value as number)}
					sx={SX_SEL}
					MenuProps={{
						PaperProps: {
							sx: {
								background: "#0f1b27",
								border: "1px solid rgba(34,197,94,0.18)",
								"& .MuiMenuItem-root": {
									fontFamily: "'Barlow',sans-serif",
									fontSize: "0.88rem",
									color: "#e2e8f0",
									"&:hover": { background: "rgba(34,197,94,0.08)" },
									"&.Mui-selected": {
										background: "rgba(34,197,94,0.12)",
										color: "#22c55e",
									},
								},
							},
						},
					}}
				>
					{exercices.map((e) => (
						<MenuItem key={e.ID_EXERCICE} value={e.ID_EXERCICE}>
							{e.NOM} — {e.CATEGORIE} ({e.MUSCLE_CIBLE})
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
				<Button
					onClick={handleConfirm}
					startIcon={<SaveIcon sx={{ fontSize: 15 }} />}
					sx={SX_BTN}
				>
					Confirmer l'exercice
				</Button>
			</Box>
		</Box>
	);
}
