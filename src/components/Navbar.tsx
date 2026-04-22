import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types";

type NavbarProps = {
	links: { label: string; path: string }[];
	profilLabel?: string;
};

export default function Navbar({ links }: NavbarProps) {
	const navigate = useNavigate();
	const { logout, token, user } = useAuth();
	const location = useLocation();
	const typedUser = user as User;
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [drawerOpen, setDrawerOpen] = useState(false);

	return (
		<>
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
							!typedUser
								? "/"
								: typedUser.role === "coach"
									? "/dashboard-coach"
									: "/dashboard-eleves"
						}
						style={{ textDecoration: "none" }}
					>
						<Typography
							variant="h6"
							sx={{
								color: "#fff",
								fontStyle: "italic",
								fontSize: "1.1rem",
								fontWeight: 700,
								letterSpacing: "0.04em",
								fontFamily: "'Barlow Condensed', sans-serif",
								whiteSpace: "nowrap",
							}}
						>
							{!typedUser
								? "CoachBoard"
								: typedUser.role === "coach"
									? `${typedUser.prenom} ${typedUser.nom} · Coach`
									: `${typedUser.prenom} ${typedUser.nom} · Élève`}
						</Typography>
					</Link>

					{!isMobile &&
						links.map((link) => (
							<Button
								key={link.path}
								onClick={() => navigate(link.path)}
								sx={{
									color:
										location.pathname === link.path ? "#22c55e" : "#7a8fa6",
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
									"&:hover::after": { width: "100%" },
								}}
							>
								{link.label}
							</Button>
						))}

					<Box sx={{ flexGrow: 1 }} />

					{token && !isMobile && (
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

					{isMobile && (
						<IconButton
							onClick={() => setDrawerOpen(true)}
							sx={{ color: "#22c55e" }}
						>
							<MenuIcon />
						</IconButton>
					)}
				</Toolbar>
			</AppBar>

			<Drawer
				anchor="right"
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				slotProps={{
					paper: {
						sx: {
							background: "#0b1520",
							borderLeft: "1px solid rgba(34,197,94,0.2)",
							width: 220,
						},
					},
				}}
			>
				<List sx={{ mt: 2 }}>
					{links.map((link) => (
						<ListItem key={link.path} disablePadding>
							<ListItemButton
								onClick={() => {
									navigate(link.path);
									setDrawerOpen(false);
								}}
							>
								<ListItemText
									primary={link.label}
									sx={{
										"& .MuiListItemText-primary": {
											color:
												location.pathname === link.path ? "#22c55e" : "#e2e8f0",
											fontFamily: "'Barlow Condensed', sans-serif",
											fontStyle: "italic",
											fontWeight: 700,
											textTransform: "uppercase",
										},
									}}
								/>
							</ListItemButton>
						</ListItem>
					))}
					{token && (
						<ListItem disablePadding sx={{ mt: 2 }}>
							<ListItemButton
								onClick={() => {
									logout();
									navigate("/login");
									setDrawerOpen(false);
								}}
							>
								<ListItemText
									primary="Déconnexion"
									sx={{
										"& .MuiListItemText-primary": {
											color: "#ef4444",
											fontFamily: "'Barlow Condensed', sans-serif",
											fontStyle: "italic",
											fontWeight: 700,
											textTransform: "uppercase",
										},
									}}
								/>
							</ListItemButton>
						</ListItem>
					)}
				</List>
			</Drawer>
		</>
	);
}
