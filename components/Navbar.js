import navbarStyles from "../styles/Navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const { pathname } = router;

  return (
    <nav className={navbarStyles.nav}>
      <div>
        <Link href="/">doit</Link>

        <ul
          className={
            pathname === "/signup"
              ? navbarStyles.hideSignupLink
              : pathname === "/login"
              ? navbarStyles.hideLoginLink
              : null
          }
        >
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </ul>
      </div>
    </nav>
  );
}
