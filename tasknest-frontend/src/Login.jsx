import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PASSWORD = "tasknest123"; // Password for authentication

function Login({ setUser }) {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === PASSWORD) {
            setUser(true);
            navigate("/tasks");
        } else {
            alert("Incorrect password");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
