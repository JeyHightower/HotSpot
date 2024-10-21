import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    return dispatch(sessionActions.login({ credential: credential.trim(), password: password.trim() }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ credential: "The provided credentials were invalid" });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    return dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password1' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      })
      .finally(() => setIsLoading(false));
  };

  const resetForm = () => {
    setCredential('');
    setPassword('');
    setErrors({});
    setIsLoading(false);
  };

  const handleCloseModal = () => {
    resetForm();
    closeModal();
  };

  //cleanup func
  useEffect(() => {
    return () => {
      setCredential('');
      setPassword('');
      setErrors({});
    };
  }, []);
  
  const isLoginDisabled = credential.trim().length < 4 || password.trim().length < 6 || isLoading;

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p className="error">{errors.credential}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="error">{errors.password}</p>}
        <button type="submit" disabled={isLoginDisabled}>
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <button onClick={handleDemoLogin} disabled={isLoading}>
        {isLoading ? "Logging in..." : "Log in as Demo User"}
      </button>
    </>
  );
}

export default LoginFormModal;