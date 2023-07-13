"use client";

import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Login from '../../src/Components/Login';
import Logout from '../../src/Components/Logout';
import { setToken, getToken } from '../../src/Components/Auth';
import Register from '../../src/Components/Register';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'next/image';
import logo from '../app/images/Logo.png';
import './globals.css'
import Promotion from './Promotion';
import 'bootstrap/dist/js/bootstrap.js';


export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [shouldShowLogin, setShouldShowLogin] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowErrorMessage(false);
    setShouldShowLogin(false);
    setShowModal(false); // Modalı kapat
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    setShouldShowLogin(true); // Yeni eklendi
  };
  

  const handlePostsClick = () => {
    const token = getToken();
    if (isLoggedIn || token) {
      window.open('/posts', '_self'); // Yeni bir pencerede /posts sayfasını açar
    } else {
      setShowModal(true);
      setShowErrorMessage(true);
      Swal.fire({
        icon: 'error',
        title: 'Yetkisiz Erişim',
        text: 'Lütfen giriş yapın.'
      });
    }
  };
  

  const handleRegister = () => {
    setIsRegistered(true);
    setShowErrorMessage(false);
    if (isRegistered) {
      setShowModal(true); // Kayıt başarılıysa login modalını göster
    } else {
      setShowModal(false); // Kayıt başarısızsa login modalını kapat
    }
  };

  useEffect(() => {
    if (shouldShowLogin) {
      setShowModal(true);
      setShouldShowLogin(false);
    }
  }, [shouldShowLogin]);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="home">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <Image src={logo} width={50} height={50} />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <div>
                  <button className="nav-link" onClick={handlePostsClick}>
                    Posts
                  </button>
                </div>
              </li>
              {isLoggedIn || getToken() ? (
                <li className="nav-item">
                  <Logout onLogout={handleLogout} />
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Register onRegister={handleRegister} />
                  </li>
                  <li className="nav-item">
                    <Button
                      variant="link"
                      className="nav-link"
                      onClick={() => setShowModal(true)}
                    >
                      Login
                    </Button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Promotion/>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login onLogin={handleLogin} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
