import { useState } from "react";
import "../Components/Signup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { size } from "mathjs";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
  
    // Validation
    if (!email || !password || !confirmPassword || !role) {
      setError('Please fill in all fields');
      return;
    }
  
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
  
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    if (role === 'select') {
      setError('Please select a valid role');
      return;
    }
  
    const userData = { email, password, role };
  
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        if (response.status === 409) {
          setError('Email already exists. Please use a different email.');
        } else {
          throw new Error('Failed to register user');
        }
        return;
      }
  
      console.log('User registered:', result);
      alert('Signup successful');
  
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div className="signup_section">
      <div className="signup_img">
        <img
          src="https://assets-news.housing.com/news/wp-content/uploads/2022/03/28143140/Difference-between-flat-and-apartment-446x260.jpg"
          alt="Flat Image"
        />
      </div>
      <div className="signup_form">
        <img src="Community-2.png" alt="Community Logo" />
        <h3>Sign Up</h3>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="password-toggle" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label htmlFor="role">Role</label>
        <select
          name="role"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="select">Select</option>
          <option value="Admin">Admin</option>
          <option value="Resident">Resident</option>
        </select>

        {error && <div className="error-message">{error}</div>}

        <button onClick={handleSignup}>Signup</button>

        <div className="column">
          <h5>Existing User</h5>
          <Link to="/login" style={{ fontSize: "15px" }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
