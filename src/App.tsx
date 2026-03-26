import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import DashboardCoach from "./pages/DashboardCoach";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";

function ProtectedRoute() {
	const { token } = useAuth();
	return token ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/login" element={<Login />} />
			<Route element={<ProtectedRoute />}>
				<Route path="/dashboard-coach" element={<DashboardCoach />} />
			</Route>
		</Routes>
	);
}

export default App;
