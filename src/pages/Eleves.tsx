import { Box, Container, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import EleveCard from "../components/EleveCard";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

export default function Eleves() {
	const { token } = useAuth();
	const [eleves, setEleves] = useState<any[]>([]);

	useEffect(() => {
		console.log("Token :", token);
		fetch("http://localhost:3310/api/eleves", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Data reçue:", data);
				setEleves(data);
			})
			.catch((err) =>
				console.error("Erreur lors de la récupération des élèves :", err),
			);
	}, []);

	return (
		<div style={{ position: "relative", zIndex: 1 }}>
			<ProgressionCanvas />
			<Navbar
				links={[
					{ label: "Programmes", path: "/programmes" },
					{ label: "Seances", path: "/seances" },
					{ label: "Exercices", path: "/exercices" },
				]}
				profilLabel="Profil"
			/>
			<Toolbar />
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, 1fr)",
							md: "repeat(3, 1fr)",
						},
						gap: 3,
					}}
				>
					{eleves.map((e) => (
						<EleveCard key={e.ID_ELEVE} eleve={e} />
					))}
				</Box>
			</Container>
		</div>
	);
}
