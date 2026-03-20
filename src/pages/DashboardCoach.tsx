import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import NavbarCoach from "../components/NavbarCoach";
import { useProgressionCanvas } from "../components/useProgressionCanvas";

export default function DashboardCoach() {
	useProgressionCanvas();
	const navigate = useNavigate();

	return (
		<div style={{ position: "relative", zIndex: 1 }}>
			<canvas
				id="progression-canvas"
				className="home__sticky-canvas"
				aria-hidden="true"
			/>
			<NavbarCoach />
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					minHeight: "200px",
					margin: "80px 0 0",
					paddingTop: "60px",
					padding: "0 36px",
					paddingBottom: "45px",
					position: "relative",
					zIndex: 2,
					borderBottom: "1px solid rgba(34, 197, 94, 0.5)",
				}}
			>
				<Box
					component="section"
					sx={{
						color: "#fff",
						padding: "24px 36px",
						position: "relative",
						zIndex: 2,
					}}
				>
					<Typography
						variant="h1"
						sx={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: "3.5rem",
							fontStyle: "italic",
							fontWeight: 700,
						}}
					>
						Dashboard Coach
					</Typography>
					<p
						style={{
							fontSize: "1.5rem",
							marginTop: "16px",
							marginBottom: "50px",
							fontFamily: "'Barlow', sans-serif",
						}}
					>
						Gérez vos programmes de coaching et suivez la progression de vos
						élèves depuis un tableau de bord central.
					</p>
				</Box>
				<Button
					variant="contained"
					onClick={() => navigate("/eleves")}
					sx={{
						alignSelf: "flex-end",
						marginRight: "200px",
						position: "relative",
						zIndex: 2,
						backgroundColor: "#22c55e",
						color: "#0b1520",
						fontStyle: "italic",
						fontSize: "1.25rem",
						fontWeight: 700,
						border: "1.5px solid #22c55e",
						borderRadius: "4px",
						"&:hover": {
							backgroundColor: "#16a34a",
							transform: "translateY(-2px)",
							boxShadow: "0 8px 28px rgba(34, 197, 94, 0.22)",
						},
					}}
				>
					Suivre mes élèves
				</Button>
			</Box>
		</div>
	);
}
