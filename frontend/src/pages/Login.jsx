import { useState } from 'react'
import { supabase } from "../lib/supabase";
import './Login.css'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  async function handleLogin(e) {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email.")
      return
    }

    if (!password) {
      setError("Please enter your password.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setError("")
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      return;
    }

    alert("Login Successful ✅");

  }
  return (
    <div className="login-page">

      <div className="login-card">

        <h1>BusinessOS</h1>

        <p>AI Powered Business Management SaaS</p>

        <form onSubmit={handleLogin}>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide Password" : "Show Password"}
          </button>

          <a href="#">Forgot Password?</a>
          {error && <p className="error">{error}</p>}
          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login