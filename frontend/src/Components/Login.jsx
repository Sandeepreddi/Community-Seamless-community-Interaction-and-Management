import { useState } from 'react';
import '../Components/Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    
    e.preventDefault();
    setError('');

    try {
        const response = await fetch('http://localhost:8080/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Invalid email or password');
        }

        const { role, isFormFilled } = await response.json();
        
        console.log(role+" "+isFormFilled);

        // Redirect based on role and form completion status
        localStorage.setItem("email",email);
        console.log("Admin",email);
        if (role === 'Admin') {
            navigate(isFormFilled ? '/admin/home' : '/admin-first-time', { state: { email } });
        } else if (role === 'Resident') {
            navigate(isFormFilled ? '/resident/home' : '/user-first-time', { state: { email } });
        } else {
            setError('Invalid role');
        }
    } catch (err) {
        setError(err.message);
    }
};


  return (
    <div className='signup_section'>
      <div className='signup_img'>
        <img src="https://assets-news.housing.com/news/wp-content/uploads/2022/03/28143140/Difference-between-flat-and-apartment-446x260.jpg" alt="Flat Image" />
      </div>
      <div className='signup_form'>
        <img src='Community-2.png' alt="Community" />
        <h3>Login</h3>
        <label htmlFor='email'>Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor='password'>Password</label>
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
        
        {error && <div className="error-message">{error}</div>}
        
        <button onClick={handleLogin}>Login</button>

        <div className='column'>
          <h5>Don&apos;t Have an Account</h5>
          <Link to="/" style={{ fontSize: "15px" }}>Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;