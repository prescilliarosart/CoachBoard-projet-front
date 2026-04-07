import { AddBox } from "@mui/icons-material";
import { useEffect, useState } from "react";
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
					{ label: "Elèves", path: "/eleves" },
					{ label: "Progression", path: "/progression" },
				]}
				profilLabel="Profil"
			/>
		</div>
	);
}
