import { useState } from 'react'
import './Login.css'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="login-page">

      <div className="login-card">

        <h1>BusinessOS</h1>

        <p>AI Powered Business Management SaaS</p>

        <form>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide Password" : "Show Password"}
          </button>

          <a href="#">Forgot Password?</a>

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login