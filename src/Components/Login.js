import React, { useState } from 'react';
import axios from 'axios';
import { setToken } from './Auth';
import Swal from 'sweetalert2';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(process.env.API_URL+'/login', { email, password });
      Swal.fire({
        icon: "success",
        text:['Login Successfull.']
      });
      const { token } = response.data;
      setToken(token);

      onLogin();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          text: "Account Not Found."
        });
      } else {
        Swal.fire({
          icon: "error",
          text: "Bir hata oluştu."
        });
      }
    }
  };

  return (
    <div>
      <form action="" id="Login" method="post" onSubmit={handleSubmit}>
        <h1>Login</h1>
      
        <p className="item">
          <label htmlFor="email"> Email </label>
          <input
            className="input-group-text"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </p>
        <p className="item">
          <label htmlFor="password"> Password </label>
          <input
            className="input-group-text"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </p>
  
        <p className="item">
          <input className="btn btn-success" type="submit" value="Login" />
        </p>
      </form>
    </div>
  );
}

export default Login;