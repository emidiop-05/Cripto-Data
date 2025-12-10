import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "30px",
        textAlign: "center",
        backgroundColor: "#bbddefff",
        borderRadius: "8px",
        boxShadow: "5px 5px 15px grey",
      }}
    >
      <h1 style={{ color: "#3f3f3f", fontFamily: "Inter" }}>Login</h1>
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
            backgroundColor: "#2281fcff",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Login
        </button>
      </form>

      <p style={{ marginTop: "20px", fontFamily: "Inter" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#16b5c7ff" }}>
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
