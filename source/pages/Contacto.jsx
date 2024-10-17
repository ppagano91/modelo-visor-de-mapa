import { useState, useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { getEnv } from "../config";
import Alerts from "../components/Alerts/Alerts";

const Contacto = () => {
  const captchaRef = useRef(null);
  const [isRobot, setIsRobot] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false); // Estado para mostrar el mensaje de error
  const [isMailSent, setIsMailSent] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCaptchaChange = value => {
    setIsRobot(!value); // El usuario no es un robot si el valor es true
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!isRobot && validateEmail(formData.correo)) {
      setIsMailSent(true);
      setFormData({
        nombre: "",
        correo: "",
        mensaje: "",
      });
      captchaRef.current.reset();
    } else if (!validateEmail(formData.correo)) {
      setShowErrorMessage(true);
    } else {
      setShowErrorMessage(true);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const successMessage = isMailSent ? (
    <div className="success-message">
      <Alerts type="success" message="¡Correo enviado con éxito!" />
    </div>
  ) : null;

  const errorMessage =
    showErrorMessage && isRobot ? (
      <div className="error-message">
        <Alerts type="warning" message="¡Por favor verifica el Captcha!" />
      </div>
    ) : null;

  const sitekey = getEnv("VITE_CAPTCHA_KEY");
  // const sitekey = "6LeWXeUpAAAAAA-yr2exn5cIJDf9u5azvIpLV62m";
  // const sitekey = "6Ld4XecpAAAAAFk3ocd547rHC_VdrDnEK-ie7EOr"

  useEffect(() => {
    let timeout;
    if (isMailSent) {
      timeout = setTimeout(() => {
        setIsMailSent(false);
      }, 3000); // 3 segundos
    }

    return () => clearTimeout(timeout);
  }, [isMailSent]);

  useEffect(() => {
    if (isMailSent) {
      captchaRef.current.reset();
    }
  }, [isMailSent]);

  useEffect(() => {
    if (formData.nombre || formData.correo || formData.mensaje) {
      setShowErrorMessage(false);
    }
  }, [formData.nombre, formData.correo, formData.mensaje]);

  return (
    <div id="contacto-informacion" style={{ width: "21rem" }}>
      <div className="m-3">
        <div className="text-justify">
          <h1
            className="fs-3"
            style={{
              fontWeight: "bold",
              fontFamily: "Nunito",
            }}
          >
            Contacto
          </h1>
          <p className="" style={{ fontSize: "0.9rem" }}>
            Utilice este formulario para hacernos llegar sus comentarios,
            sugerencias, consultas o críticas respecto al Mapa Interactivo de
            Buenos Aires. Asegúrese de ingresar una dirección de email válida
            para que podamos responderle.
          </p>
        </div>

        <div className="">
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-1">
            <div className="input-group">
              <input
                className="w-100 form-control"
                style={{
                  fontFamily: "Open Sans",
                }}
                type="text"
                placeholder="Nombre (*)"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                className="w-100 form-control"
                style={{
                  fontFamily: "Open Sans",
                }}
                type="email"
                placeholder="Correo electrónico"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                // hacer mas alto el input de mensaje con opci0n de expandirlo

                style={{ height: "8rem", fontFamily: "Open Sans" }}
                className="w-200  form-control "
                type="text"
                placeholder="Mensaje (*)"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleInputChange}
                required
              />
            </div>
            <ReCAPTCHA
              ref={captchaRef}
              sitekey={sitekey}
              onChange={handleCaptchaChange}
              id="reCAPTCHA"
            />
            {errorMessage}
            {successMessage}
            <button
              className="btn btn-warning w-25"
              type="submit"
              style={{
                fontFamily: "Open Sans",
              }}
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
