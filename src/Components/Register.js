import axios from "axios";
import { useState } from "react";
import React from "react";
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Register({ onRegister }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');
  const [validationError, setValidationError] = useState({});

  const handleSubmit = e => {
    e.preventDefault();

    // Handle validations

    axios
      .post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
        password_confirmation
      })
      .then(response => {
        Swal.fire({
          icon:"success",
          text:response.data.status=['Account creation successful']
        })
        setName('');
        setEmail('');
        setPassword('');
        setPassword_confirmation('');
        setShow(false); // Kayıt başarılı olduğunda login modalını kapat
        onRegister(); // Ana bileşene kayıt başarılı olduğunu iletiyoruz
        console.log(response);
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
          const errorMessages = error.response.data.error;
          const errorMessage = Object.values(errorMessages)[0][0];

          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: errorMessage,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'Bir hata oluştu.',
          });
        }
      });
  }

  return (
    <div>
      <>
        <Button variant="link" className="nav-link" onClick={() => setShow(true)}>
          Register
        </Button>

        <Modal
          show={show}
          onHide={() => setShow(false)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Register
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form action="" id="Register" method="post" onSubmit={handleSubmit}>
              <h1>Register</h1>
              <p className="item">
                <label htmlFor="name"> Name </label>
                <input
                  className="input-group-text"
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </p>
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
                <label htmlFor="password_confirmation"> Password confirmation </label>
                <input
                  className="input-group-text"
                  type="password"
                  name="password_confirmation"
                  id="password_confirmation"
                  value={password_confirmation}
                  onChange={e => setPassword_confirmation(e.target.value)}
                  required
                />
              </p>
              <p className="item">
                <input className="btn btn-success" type="submit" value="Register" />
              </p>
            </form>

            {Object.keys(validationError).length > 0 && (
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-danger">
                    <ul className="mb-0">
                      {Object.entries(validationError).map(([key, value]) => (
                        <li key={key}>{value}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
}

export default Register
