import React, { useState } from 'react'
import styles from './AuthLogin.module.css'
import loginImg from '../../assets/loginImg.png'
import { Link } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import facebooklogo from '../../assets/logos_facebook.png';
import googlelogo from '../../assets/google-original.png';

const AuthLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.register}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6">
            <h2>Login</h2>
            <p>New user?<Link to='/register'>Sign up</Link></p>
            <form >
              <div className="mb-2">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" placeholder="Username" />
              </div>
              {/* Password */}
              <div className="mb-2 position-relative">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control rounded-end"
                    id="password"
                    placeholder="Password"
                  />
                  <span
                    className={styles.inputGroupText}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className="mb-2 d-flex justify-content-between align-items-center">
                {/* Checkbox for "Remind me" */}
                <div className={`form-check ${styles.checkbox}`}>
                  <input className={styles.formCheckInput} type="checkbox" id="remindMe" />
                  <label className="form-check-label" htmlFor="remindMe">Remind me</label>
                </div>

                {/* Forget Password Link */}
                <h4 className="mb-0">
                  <Link to="/forget-password">Forget Password?</Link>
                </h4>

              </div>
              <Link type="submit" className="cta rounded-4 w-100">Login</Link>
              {/* Or Signup with */}
              <div className="text-center mt-3">
                <p className={styles.lineth}>Or sign up with</p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to={'/login'} type="button" className={styles.btn}>
                    <img src={googlelogo} alt="google logo" className='img-fluid' />Google</Link>
                  <Link to={'/login'} type="button" className={styles.btn}>
                    <img src={facebooklogo} alt="facebook logo" className='img-fluid' />
                    Facebook</Link>
                </div>
              </div>
            </form>
          </div>
          <div className="col-12 col-md-6 mt-5 mt-md-0">
            <img src={loginImg} alt="img for login page" className={`img-fluid ${styles.registerImg}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLogin
