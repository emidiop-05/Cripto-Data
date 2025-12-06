// client/src/pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic validation: Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // 2. Register the user
      const response = await axios.post("http://localhost:5000/api/users", {
        name,
        email,
        password,
      });

      // 3. If successful, save user and redirect to dashboard immediately
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/");
        window.location.reload(); // Refresh to update Navbar
      }
    } catch (error) {
      console.error(error);
      // Show the error message from the backend (e.g., "User already exists")
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <h1>Create Account</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          name="name"
          value={name}
          placeholder="Full Name"
          onChange={onChange}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Email Address"
          onChange={onChange}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={onChange}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          placeholder="Confirm Password"
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
          Sign Up
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#16c784" }}>
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
