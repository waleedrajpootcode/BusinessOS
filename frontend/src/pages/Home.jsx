import './Home.css'
import { Link } from 'react-router-dom'
function Home() {
     return (
  <div className="home">
    <h1>BusinessOS</h1>
    <p>AI Powered Business Management SaaS</p>
    <Link to="/login">
  <button>Get Started</button>
</Link>
  </div>
)
}

export default Home