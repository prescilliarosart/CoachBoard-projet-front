import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type NavbarProps = {
	links: { label: string; path: string }[];
	profilLabel?: string;
};

export default function Navbar({ links }: NavbarProps) {
	const navigate = useNavigate();
	const { logout, token, user } = useAuth();
	const location = useLocation();
	return (
		<AppBar
			sx={{
				background: "rgba(11, 21, 32, 0.9)",
				backdropFilter: "blur(16px)",
				borderBottom: "1px solid rgba(34, 197, 94, 0.13)",
			}}
		>
			<Toolbar sx={{ alignItems: "center" }}>
				<Link
					to={
						(user as any)?.role === "coach"
							? "/dashboard-coach"
							: "/dashboard-eleves"
					}
					style={{ textDecoration: "none" }}
				>
					<Typography
						variant="h6"
						component="div"
						sx={{
							color: "#fff",
							fontStyle: "italic",
							fontSize: "1.1rem",
							fontWeight: 700,
							letterSpacing: "0.04em",
							fontFamily: "'Barlow Condensed', sans-serif",
						}}
					>
						Julien Marchal · Coach Sportif
					</Typography>
				</Link>
				{links.map((link) => (
					<Button
						key={link.path}
						onClick={() => navigate(link.path)}
						sx={{
							color: location.pathname === link.path ? "#22c55e" : "#7a8fa6",
							position: "relative",
							padding: 0,
							"&:hover": { color: "#22c55e" },
							marginLeft: "32px",
							fontSize: "0.88rem",
							fontWeight: 500,
							"&::after": {
								content: '""',
								position: "absolute",
								left: 0,
								bottom: "-3px",
								width: 0,
								height: "1.5px",
								background: "#22c55e",
								transition: "width 0.25s",
							},
							"&:hover::after": {
								width: "100%",
							},
						}}
					>
						{link.label}
					</Button>
				))}

				<Box sx={{ flexGrow: 1 }} />

				{token && ( // 👈 s'affiche seulement si connecté
					<Button
						onClick={() => {
							logout();
							navigate("/login");
						}}
						sx={{
							color: "#ef4444",
							marginLeft: "12px",
							fontStyle: "italic",
							fontSize: "0.92rem",
							fontWeight: 700,
							border: "1.5px solid #ef4444",
							borderRadius: "4px",
							"&:hover": { background: "#ef4444", color: "#fff" },
						}}
					>
						Déconnexion
					</Button>
				)}
			</Toolbar>
		</AppBar>
	);
}
