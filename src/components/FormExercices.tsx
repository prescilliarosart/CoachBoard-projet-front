import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

type TypeExercice = "Cardio" | "Muscu" | "Mobilité" | "HIIT" | "Stretching";
const TYPES: TypeExercice[] = [
	"Cardio",
	"Muscu",
	"Mobilité",
	"HIIT",
	"Stretching",
];
const MUSCLES = [
	"Épaule",
	"Dos",
	"Pectoraux",
	"Triceps",
	"Biceps",
	"Abdos",
	"Lombaires",
	"Fessiers",
] as const;
type Muscle = (typeof MUSCLES)[number];

interface FormData {
	nom: string;
	description: string;
	muscles: Muscle[];
	type: TypeExercice | "";
	video: File | null;
	image: File | null;
}

interface Props {
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

const SX_LB = {
	fontFamily: "'Barlow',sans-serif",
	fontSize: "0.78rem",
	fontWeight: 600,
	color: "#7a8fa6",
	textTransform: "uppercase" as const,
	letterSpacing: "0.08em",
	mb: "10px",
};

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

const MENU = {
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

function UploadZone({
	label,
	accept,
	file,
	onFile,
}: {
	label: string;
	accept: string;
	file: File | null;
	onFile: (f: File | null) => void;
}) {
	const ref = useRef<HTMLInputElement>(null);
	const preview = file ? URL.createObjectURL(file) : null;
	const isVideo = accept.includes("video");

	return (
		<Box>
			<Typography sx={SX_LB}>{label}</Typography>
			<Box
				onClick={() => !file && ref.current?.click()}
				sx={{
					width: "100%",
					aspectRatio: "16/9",
					background: "#111e2c",
					border: "1px solid rgba(34,197,94,0.18)",
					borderRadius: "8px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					cursor: file ? "default" : "pointer",
					position: "relative",
					overflow: "hidden",
					transition: "border-color 0.2s",
					"&:hover": !file
						? { borderColor: "#22c55e", background: "rgba(34,197,94,0.04)" }
						: {},
				}}
			>
				{preview ? (
					<>
						{isVideo ? (
							<video
								src={preview}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
								controls
							>
								<track kind="captions" />
							</video>
						) : (
							<img
								src={preview}
								alt="preview"
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
						)}
						<Box
							onClick={(e) => {
								e.stopPropagation();
								onFile(null);
							}}
							sx={{
								position: "absolute",
								top: 8,
								right: 8,
								width: 24,
								height: 24,
								borderRadius: "50%",
								background: "rgba(0,0,0,0.7)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								"&:hover": { background: "rgba(200,50,50,0.8)" },
							}}
						>
							<CloseIcon sx={{ fontSize: 14, color: "#fff" }} />
						</Box>
					</>
				) : (
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "6px",
						}}
					>
						<Box
							sx={{
								width: 32,
								height: 32,
								borderRadius: "50%",
								background: "rgba(34,197,94,0.1)",
								border: "1px solid rgba(34,197,94,0.25)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<AddIcon sx={{ fontSize: 18, color: "#22c55e" }} />
						</Box>
						<Typography sx={{ fontSize: "0.75rem", color: "#3a5060" }}>
							{isVideo ? "Vidéo" : "Image"}
						</Typography>
					</Box>
				)}
			</Box>
			<input
				ref={ref}
				type="file"
				accept={accept}
				style={{ display: "none" }}
				onChange={(e) => onFile(e.target.files?.[0] ?? null)}
			/>
		</Box>
	);
}

export default function FormExercice({ onSuccess }: Props) {
	const { token } = useAuth();
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState<FormData>({
		nom: "",
		description: "",
		muscles: [],
		type: "",
		video: null,
		image: null,
	});

	const toggle = (m: Muscle) =>
		setForm((f) => ({
			...f,
			muscles: f.muscles.includes(m)
				? f.muscles.filter((x) => x !== m)
				: [...f.muscles, m],
		}));

	const handleSave = async () => {
		if (!form.nom || !form.type) {
			alert("Veuillez remplir le nom et le type.");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch("http://localhost:3310/api/exercices", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					nom: form.nom,
					description: form.description,
					groupe_musculaire: form.muscles.join(", "),
					type: form.type,
				}),
			});

			if (!response.ok) throw new Error("Erreur création exercice");

			onSuccess();
		} catch (err) {
			console.error("Erreur FormExercice :", err);
			alert("Impossible de créer l'exercice.");
		} finally {
			setLoading(false);
		}
	};
}
