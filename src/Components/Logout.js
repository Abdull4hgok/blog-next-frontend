import React, { useEffect} from "react";
import { axiosapi } from './Auth';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button'

const Logout = ({ onLogout }) => {
  const getLogout = () => {
    axiosapi
      .post('/logout')
      .then((response) => {
        localStorage.removeItem('token');
        Swal.fire({
          icon: 'success',
          text: response.data.message
        }).then(() => {
          onLogout(); // Logout işlemi tamamlandığında onLogout fonksiyonunu çağır
        });
      })
      .catch(() => {
        Swal.fire({
          text: ['Hata'],
          icon: 'error'
        });
      });
  };

  return (
    <div>
      <Button variant="link" className="nav-link" onClick={getLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Logout; 
