import loginPageStyles from "../styles/Login.module.css";
import Link from "next/link";
import { useState } from "react";
import Meta from "../components/Meta";
import { auth, db } from "../firebase/main";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function signupPage() {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  //error handler
  const [error, setError] = useState("");

  const [signingUp, setSigningUp] = useState(false);

  const router = useRouter();

  //signup
  const signUp = (e) => {
    e.preventDefault();
    if (email.includes("@") && !email.includes(" ")) {
      if (password1.length >= 8) {
        if (password1 === password2) {
          //store user to db if form is fine
          setSigningUp(true);
          auth
            .createUserWithEmailAndPassword(email, password1)
            .then(() => {
              db.collection("users")
                .add({ email: email, signedUpOn: new Date() })
                .then(() => {
                  router.push("/login");
                });
            })
            .catch((err) => {
              setSigningUp(false);
              setError(err.message);
            });
        } else setError("Passwords didn't match.");
      } else setError("Password must be 8 characters long.");
    } else setError("Email must be valid");
  };

  return (
    <>
      <Navbar />
      <div className={loginPageStyles.loginPage}>
        <Meta title="robodoit- Signup" />
        <div>
          <form onSubmit={signUp}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password1} onChange={(e) => setPassword1(e.target.value)} />
            <label htmlFor="password2">Repeat password</label>
            <input type="password" id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} />
            <button disabled={signingUp}>Signup</button>
            <p style={{ opacity: "0.6" }}>By signing up, you agree to our terms and policies.</p>
            <p style={{ fontSize: "12px", color: "orange", marginLeft: "10px" }}>{error}</p>
            <p>
              Already have an account? <Link href="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
