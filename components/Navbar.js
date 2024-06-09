import navbarStyles from "../styles/Navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext } from "react";
import UserContext from "../userContext";

export default function Navbar() {
  const router = useRouter();
  const { pathname } = router;
  const { currentUserEmail } = useContext(UserContext);

  return (
    <nav className={navbarStyles.nav}>
      <div>
        <Link href="/">robodoit</Link>

        <ul
          className={
            pathname === "/signup"
              ? navbarStyles.hideSignupLink
              : pathname === "/login"
              ? navbarStyles.hideLoginLink
              : null
          }
        >
          {currentUserEmail ? (
            <Link href="/app">Go to App</Link>
          ) : (
            <Fragment>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </Fragment>
          )}
        </ul>
      </div>
    </nav>
  );
}
