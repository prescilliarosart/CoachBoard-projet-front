import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

type EleveProgramme = {
	id_eleve_programme: number;
	nom: string;
	objectif: string;
	duree: number;
	date_debut: string;
	date_fin: string;
	statut: string;
};

const elevLinks = [
	{ label: "Mon Suivi", path: "/mon-suivi" },
	{ label: "Programmes", path: "/mon-programme" },
];

export default function MonProgramme() {
	const { user, token } = useAuth();
	const [programmes, setProgrammes] = useState<EleveProgramme[]>([]);

	useEffect(() => {
		if (!user) return;
		fetch(`/api/elevesprogrammes/eleve/${user.id}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then(setProgrammes)
			.catch(console.error);
	}, [user, token]);

	return (
		<>
			<Navbar links={elevLinks} />
			<Box sx={{ mt: 10, p: 4 }}>
				<Typography variant="h5" sx={{ fontWeight: 700, color: "#fff", mb: 3 }}>
					Mes Programmes
				</Typography>

				{programmes.length === 0 ? (
					<Typography sx={{ color: "#7a8fa6" }}>
						Aucun programme attribué pour le moment.
					</Typography>
				) : (
					programmes.map((p) => (
						<Box
							key={p.id_eleve_programme}
							sx={{
								mb: 2,
								p: 3,
								border: "1px solid rgba(34, 197, 94, 0.2)",
								borderRadius: 2,
								background: "rgba(11, 21, 32, 0.6)",
							}}
						>
							<Box
								sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
							>
								<Typography
									sx={{ fontWeight: 700, color: "#fff", fontSize: "1.1rem" }}
								>
									{p.nom}
								</Typography>
								<Chip
									label={p.statut}
									size="small"
									sx={{
										background:
											p.statut === "actif"
												? "rgba(34,197,94,0.15)"
												: "rgba(122,143,166,0.15)",
										color: p.statut === "actif" ? "#22c55e" : "#7a8fa6",
										fontWeight: 600,
									}}
								/>
							</Box>
							<Typography sx={{ color: "#7a8fa6", mb: 1 }}>
								{p.objectif}
							</Typography>
							<Typography variant="body2" sx={{ color: "#7a8fa6" }}>
								Durée : {p.duree} semaines · Du {p.date_debut} au {p.date_fin}
							</Typography>
						</Box>
					))
				)}
			</Box>
		</>
	);
}
