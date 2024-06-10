import loginPageStyles from "../styles/Login.module.css";
import Link from "next/link";
import { useContext, useState } from "react";
import Meta from "../components/Meta";
import { useRouter } from "next/router";
import { auth, db } from "../firebase/main";
import Navbar from "../components/Navbar";
import UserContext from "../userContext";

export default function loginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const router = useRouter();

  const { setEmailAddress } = useContext(UserContext);

  const logIn = (e) => {
    e.preventDefault();
    setLoggingIn(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        //getting login token from db and storing in local storage
        db.collection("users")
          .where("email", "==", email)
          .get()
          .then((docs) => {
            docs.forEach((doc) => {
              localStorage.setItem("loginToken", doc.id);
            });
            setEmailAddress(email);
            router.push("/app");
          });
      })
      .catch((err) => {
        setError(err.message);
        setLoggingIn(false);
      });
  };

  return (
    <>
      <Navbar />
      <div className={loginPageStyles.loginPage}>
        <Meta title="robodoit - Login" />
        <div>
          <form onSubmit={logIn}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button disabled={loggingIn}>Login</button>
            <p style={{ fontSize: "12px", color: "orange", marginLeft: "10px" }}>{error}</p>
            <p>
              Don't have an account? <Link href="/signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
