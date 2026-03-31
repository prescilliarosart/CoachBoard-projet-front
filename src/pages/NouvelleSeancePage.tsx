import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";

interface FormSeance {
	titre: string;
	jour: string;
	ordre: number | "";
	id_programme: number | "";
}

const JOURS = [
	"Lundi",
	"Mardi",
	"Merecredi",
	"Jeudi",
	"Vendredi",
	"Samedi",
	"Dimanche",
];

const MOCK_PROGRAMMES = [
	{ id: 1, nom: "Prise de masse" },
	{ id: 2, nom: "Perte de poids" },
	{ id: 3, nom: "Remise en forme" },
];

export default function NouvelleSeancePage() {
	const [form, setForm] = useState<FormSeance>({
		titre: "",
		jour: "",
		ordre: "",
		id_programme: "",
	});

	return (
		<div style={{ position: "relative", zIndex: 1 }}>
			<ProgressionCanvas />
			<Navbar
				links={[
					{ label: "Programmes", path: "/programmes" },
					{ label: "Élèves", path: "/eleves" },
					{ label: "Progression", path: "/progression" },
				]}
				profilLabel="Mon profil - Coach"
			/>
		</div>
	);
}
