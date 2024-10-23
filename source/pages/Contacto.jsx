import { useState, useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { getEnv } from "../config";
import Alerts from "../components/Alerts/Alerts";

const Contacto = () => {
  const captchaRef = useRef(null);
  const [isRobot, setIsRobot] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isMailSent, setIsMailSent] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
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
    setIsRobot(!value);
    if (value) {
      setShowErrorMessage(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setFormSubmitted(true);

    if (
      !isRobot &&
      validateEmail(formData.correo) &&
      formData.nombre &&
      formData.mensaje
    ) {
      setIsMailSent(true);
      setFormData({
        nombre: "",
        correo: "",
        mensaje: "",
      });
      setFormSubmitted(false);
      setIsRobot(true);
      captchaRef.current.reset();
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

  const captchaErrorMessage =
    showErrorMessage && isRobot ? (
      <div className="error-message mt-2">
        <Alerts type="warning" message="¡Por favor verifica el Captcha!" />
      </div>
    ) : null;

  const sitekey = getEnv("VITE_CAPTCHA_KEY");

  useEffect(() => {
    let timeout;
    if (isMailSent) {
      timeout = setTimeout(() => {
        setIsMailSent(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isMailSent]);

  useEffect(() => {
    if (isMailSent) {
      captchaRef.current.reset();
    }
  }, [isMailSent]);

  return (
    <div
      id="contacto-informacion"
      style={{
        width: "21rem",
        maxHeight: "90vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div className="m-3">
        <div className="text-justify">
          <h1 className="fs-3" style={{ fontWeight: "bold" }}>
            Contacto
          </h1>
          <p className="text fw-normal">
            Utilice este formulario para hacernos llegar sus comentarios,
            sugerencias, consultas o críticas respecto al Mapa Interactivo de
            Buenos Aires. Asegúrese de ingresar una dirección de email válida
            para que podamos responderle.
          </p>
        </div>

        <div className="">
          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column gap-1"
            noValidate
          >
            <div className="mb-3 ">
              <h6 htmlFor="nombre" className="text fw-bold">
                Nombre*
              </h6>
              <input
                className={`form-control ${
                  formSubmitted && !formData.nombre ? "is-invalid" : ""
                }`}
                style={{
                  fontFamily: "Open Sans",
                }}
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
              <div className="invalid-feedback">El nombre es requerido</div>
            </div>

            <div className="mb-3">
              <h6 htmlFor="correo" className="text fw-bold">
                Correo electrónico*
              </h6>
              <input
                className={`form-control ${
                  formSubmitted &&
                  (!formData.correo || !validateEmail(formData.correo))
                    ? "is-invalid"
                    : ""
                }`}
                style={{
                  fontFamily: "Open Sans",
                }}
                type="email"
                placeholder="ejemplo@ejemplo.com"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                required
              />
              <div className="invalid-feedback">
                Ingrese un correo electrónico válido
              </div>
            </div>

            <div className="mb-3">
              <h6 htmlFor="mensaje" className="text fw-bold">
                Mensaje*
              </h6>
              <input
                style={{ height: "8rem", fontFamily: "Open Sans" }}
                className={`form-control ${
                  formSubmitted && !formData.mensaje ? "is-invalid" : ""
                }`}
                type="text"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleInputChange}
                required
              />
              <div className="invalid-feedback">El mensaje es requerido</div>
            </div>

            <ReCAPTCHA
              ref={captchaRef}
              sitekey={sitekey}
              onChange={handleCaptchaChange}
              id="reCAPTCHA"
            />
            {captchaErrorMessage}
            {successMessage}
            <button
              className="btn w-25"
              type="submit"
              style={{
                fontFamily: "Open Sans",
                backgroundColor: getEnv("VITE_COLOR_SECONDARY"),
                color: "white",
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
