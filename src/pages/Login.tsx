import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		mot_de_passe: "",
	});

	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:3310/api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const { token } = await response.json();
			const loggedUser = login(token);

			if (!loggedUser) return;

			if (loggedUser.role === "coach") {
				navigate("/dashboard-coach");
			} else {
				navigate("/dashboard-eleve");
			}
		} catch (_err) {
			setError("Identifiants incorrects");
		}
	};
	return (
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				name="email"
				value={formData.email}
				onChange={handleChange}
			/>
			<input
				type="password"
				name="mot_de_passe"
				value={formData.mot_de_passe}
				onChange={handleChange}
			/>
			{error && <p>{error}</p>}

			<button type="submit">Se connecter</button>
		</form>
	);
}

export default LoginPage;
