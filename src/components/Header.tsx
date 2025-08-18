import { Link } from "react-router"

export default function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/courseboard">CourseBoard</Link>
      </nav>
    </header>
  )
}