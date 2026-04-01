import DeleteIcon from "@mui/icons-material/Delete";
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
	Toolbar,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

interface FormSeance {
	titre: string;
	jour: string;
	ordre: number | "";
	id_programme: number | "";
}

interface Programme {
	ID_PROGRAMME: number;
	NOM: string;
}

const seances_fictives = [
	{
		id: 1,
		titre: "Push",
		jour: "Lundi",
		ordre: 1,
		programme: "Prise de masse",
	},
	{
		id: 2,
		titre: "Pull",
		jour: "Mardi",
		ordre: 2,
		programme: "Prise de masse",
	},
	{
		id: 3,
		titre: "Legs",
		jour: "Mercredi",
		ordre: 3,
		programme: "Prise de masse",
	},
	{
		id: 4,
		titre: "Full Body",
		jour: "Jeudi",
		ordre: 4,
		programme: "Prise de masse",
	},
	{
		id: 5,
		titre: "Cardio",
		jour: "Vendredi",
		ordre: 5,
		programme: "Prise de masse",
	},
	{
		id: 6,
		titre: "Mobilité",
		jour: "Samedi",
		ordre: 6,
		programme: "Prise de masse",
	},
	{
		id: 7,
		titre: "Repos actif",
		jour: "Dimanche",
		ordre: 7,
		programme: "Prise de masse",
	},

	{
		id: 8,
		titre: "HIIT",
		jour: "Lundi",
		ordre: 1,
		programme: "Perte de poids",
	},
	{
		id: 9,
		titre: "Cardio",
		jour: "Mardi",
		ordre: 2,
		programme: "Perte de poids",
	},
	{
		id: 10,
		titre: "Circuit",
		jour: "Mercredi",
		ordre: 3,
		programme: "Perte de poids",
	},
	{
		id: 11,
		titre: "HIIT 2",
		jour: "Jeudi",
		ordre: 4,
		programme: "Perte de poids",
	},
	{
		id: 12,
		titre: "Renfo",
		jour: "Vendredi",
		ordre: 5,
		programme: "Perte de poids",
	},
	{
		id: 13,
		titre: "Stretching",
		jour: "Samedi",
		ordre: 6,
		programme: "Perte de poids",
	},
	{
		id: 14,
		titre: "Repos actif",
		jour: "Dimanche",
		ordre: 7,
		programme: "Perte de poids",
	},

	{
		id: 15,
		titre: "Full Body",
		jour: "Lundi",
		ordre: 1,
		programme: "Remise en forme",
	},
	{
		id: 16,
		titre: "Cardio",
		jour: "Mardi",
		ordre: 2,
		programme: "Remise en forme",
	},
	{
		id: 17,
		titre: "Renfo",
		jour: "Mercredi",
		ordre: 3,
		programme: "Remise en forme",
	},
	{
		id: 18,
		titre: "Mobilité",
		jour: "Jeudi",
		ordre: 4,
		programme: "Remise en forme",
	},
	{
		id: 19,
		titre: "Cardio 2",
		jour: "Vendredi",
		ordre: 5,
		programme: "Remise en forme",
	},
	{
		id: 20,
		titre: "Stretching",
		jour: "Samedi",
		ordre: 6,
		programme: "Remise en forme",
	},
	{
		id: 21,
		titre: "Repos actif",
		jour: "Dimanche",
		ordre: 7,
		programme: "Remise en forme",
	},
];

const exercices_fictifs = [
	{ id: 1, nom: "Squat", muscles: ["Fessiers", "Biceps"], type: "Muscu" },
	{ id: 2, nom: "Pompes", muscles: ["Pectoraux", "Triceps"], type: "Muscu" },
	{ id: 3, nom: "Gainage", muscles: ["Abdos", "Lombaires"], type: "Cardio" },
	{ id: 4, nom: "Fentes", muscles: ["Fessiers", "Biceps"], type: "Muscu" },
	{ id: 5, nom: "Burpees", muscles: ["Épaule", "Abdos"], type: "HIIT" },
	{ id: 6, nom: "Tractions", muscles: ["Dos", "Biceps"], type: "Muscu" },
	{ id: 7, nom: "Course", muscles: [], type: "Cardio" },
	{ id: 8, nom: "Étirements", muscles: ["Épaule", "Dos"], type: "Stretching" },
];

export default function NouvelleSeance() {
	const navigate = useNavigate();
	const { token } = useAuth();

	const [seances, setSeances] = useState(seances_fictives);
	const [programmes, setProgrammes] = useState<Programme[]>([]);

	const [form, setForm] = useState<FormSeance>({
		titre: "",
		jour: "",
		ordre: "",
		id_programme: "",
	});

	useEffect(() => {
		fetch("http://localhost:3310/api/programmes", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Programmes chargés :", data);
				setProgrammes(data);
			})
			.catch((err) =>
				console.error("Erreur lors du chargement des programmes :", err),
			);
	}, []);

	const handleSave = () => {
		if (!form.titre || !form.jour || !form.ordre || !form.id_programme) return;
		navigate("/seances");
	};

	const handleDelete = (id: number) => {
		setSeances(seances.filter((s) => s.id !== id));
	};
}
