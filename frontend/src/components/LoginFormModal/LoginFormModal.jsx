import { React, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginFormModal.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  //! Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  //! variable to determine if the 'login' button should be disabled
  //! input validation
  const isLoginDisabled = credential.length < 4 || password.length < 6;

  //! function to handle the 'login as demo user button click'
  //! handle demo user login
  const handleDemoLogin = (e) => {
    e.preventDefault();
    setErrors({});

    //make sure these are the correct credential for demo user login
    const demoUser = {
      id: 20,
      credential: "newdemo@user.io",
      password: "123password",
    };
    //! Simulate a successful login by dispatching the loginSuccess action with the demo user
    //! This will update the Redux store and log the user in as the demo user.
    return dispatch(sessionActions.loginSuccess(demoUser)).then(closeModal);
  };

  //! useEffect to reset the modal when it closes. 
  useEffect(() => {
    //!function to reset the form fields and errors
    const resetModal = () => {
      setCredential("");
      setPassword("");
      setErrors({});
    };
    //! reset the modal when it closes
    resetModal();

    //!Cleanup: remove any potential event listeners(optional)
    return () => {};
  }, [closeModal]);
  

  //! jsx to render the login form Modal
  return (
    //! main container for the modal
    <div className="login-form-modal">
      <form onSubmit={handleSubmit} className="login-form-container">
        <div className="new-div">This is a new div!</div>
        <h2>Log In</h2>
        //!unordered list to display any validation errors during login
        <ul className="error-list">
          {Object.values(errors).map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
        //!input field for username or email
        <label>
          Username or Email
          <input
            type="text"
            //!bind the input value to the credential state variable
            value={credential}
            //! update the credential state when input changes
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        //!input field for password
        <label>
          Password
          <input
            type="password"
            //!bind the input value to the password state variable
            value={password}
            //! update the password state when input changes
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        //!button to submit the login form
        <button type="submit" disabled={isLoginDisabled}>
          Log In
        </button>
        //! button to trigger a demo user login
        <button type="button" onClick={handleDemoLogin}>
          Log in as Demo User{" "}
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
