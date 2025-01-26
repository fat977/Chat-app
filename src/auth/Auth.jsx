import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./auth.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const toggleView = () => setIsLogin(!isLogin);

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userChats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created successfully! You can login now!");
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth row d-flex align-items-center vh-100">
      <div className="col-lg-6 d-flex justify-content-end">
        {isLogin ? (
          <div className="login  w-75 p-3 shadow justify-content-center d-flex align-items-center">
            <Form onSubmit={handleLogin} className="text-center">
              <h2>Sign in</h2>
              <Form.Control
                type="email"
                placeholder="Email..."
                name="email"
                className="mb-3"
              />
              <Form.Control
                type="password"
                placeholder="Password..."
                name="password"
                className="mb-3"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Loading" : "Sign in"}
              </Button>
              <div className="d-flex gap-3 align-items-center">
                <p>Don't have an account ?</p>
                <p className="register-p border p-2" onClick={toggleView}>
                  Sign up
                </p>
              </div>
            </Form>
          </div>
        ) : (
          <div className="register w-75 justify-content-center p-3 shadow d-flex align-items-center">
            <Form onSubmit={handleRegister} className="text-center">
              <h2>Sign up</h2>
              <Form.Control
                type="text"
                placeholder="Username..."
                name="username"
                className="mb-3"
              />
              <Form.Control
                type="email"
                placeholder="Email..."
                name="email"
                className="mb-3"
              />
              <Form.Control
                type="password"
                placeholder="Password..."
                name="password"
                className="mb-3"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Loading" : "Sign up"}
              </Button>

              <div className="d-flex gap-3 align-items-center">
                <p> Have already an acoount ?</p>{" "}
                <p className="login-p border p-2" onClick={toggleView}>
                  Sign in
                </p>
              </div>
            </Form>
          </div>
        )}
      </div>
      <FontAwesomeIcon className="col-lg-1" icon={faArrowLeft} />

      <div className="welcome col-lg-4">
        <div className="d-flex align-items-center gap-3">
          <p className="mb-0 shadow p-5 text-center">
            {" "}
            <span className="fw-bold">Welcome</span> to our App
          </p>
        </div>
      </div>
    </div>
  );
}
