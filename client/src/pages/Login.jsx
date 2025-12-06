// client/src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Added 'Link' for the register button

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send data to YOUR backend
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );

      // 2. If success, save the TOKEN to the browser's memory
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        // 3. Redirect to the Dashboard (Home) and refresh to update Navbar
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      // Show the error coming from the backend (if available) or a generic one
      setError(
        error.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Enter your email"
          onChange={onChange}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Enter password"
          onChange={onChange}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            cursor: "pointer",
            backgroundColor: "black",
            color: "white",
            border: "none",
          }}
        >
          Login
        </button>
      </form>

      {/* NEW LINK TO REGISTER PAGE */}
      <p style={{ marginTop: "20px" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#16c784" }}>
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
