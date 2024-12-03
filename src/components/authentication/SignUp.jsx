import { useState } from "react";
import "./StyleAuth.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useForm } from "react-hook-form";

function SignUp() {

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [countrySelector, setCountrySelector] = useState({
    country,
    region,
  });

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({});

  const handleCreateUser = async (data) => {
    try {
      await axios({
        method: "POST",
        url: `${import.meta.env.VITE_API_URL}/users`,
        data: {
          firstname,
          lastname,
          email,
          phoneNumber,
          password,
          address,
          country,
          region,
          zipCode,
        },
      });
      navigate("/login");
    } catch (err) {
      console.error("Error al crear usuario:", err);
    }
  };
  return (
    <>
      <div className="login-container d-flex justify-content-center align-items-center ">
        <div className="row w-75 shadow h-75">
          <div className="col-md-5 col-lg-7 d-md-flex left-col p-4 flex-column justify-content-between rounded-start signup-image">
            <img src="/logo-igourmet.png" alt="Logo" className="signup-logo" />
          </div>
          <div className="col-12 col-lg-5 corners bg-white py-4 d-flex flex-column  justify-content-center px-4 px-lg-5">
            <h2 className="">Registrate</h2>
            <p>Ingresá tus datos y disfrutá de Igourmet.</p>
            <form onSubmit={handleSubmit(handleCreateUser)} className="w-100">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label hidden htmlFor="firstname">
                    Nombre
                  </label>
                  <input
                    {...register("firstname", { required: true })}
                    name="firstname"
                    id="firstname"
                    placeholder="Nombre"
                    className="form-control p-1"
                  />
                  {errors.firstname?.type === "required" && (
                    <p className="text-danger">Por favor, insertar nombre.</p>
                  )}
                </div>
                <div className="col-md-6 mb-2">
                  <label hidden htmlFor="lastname">
                    Apellido
                  </label>
                  <input
                    name="lastname"
                    id="lastname"
                    placeholder="Apellido"
                    className="form-control p-1"
                    {...register("lastname", { required: true })}
                  />
                  {errors.lastname?.type === "required" && (
                    <p className="text-danger">Por favor, insertar apellido.</p>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <label hidden htmlFor="email">
                  Correo electónico
                </label>
                <input
                  {...register("email", {
                    required: true,
                    pattern: /([\w\.]+)@([\w\.]+)\.(\w+)/gi,
                  })}
                  name="email"
                  id="email"
                  placeholder="Correo electrónico"
                  className="form-control p-1 w-100"
                />
                {errors.email?.type === "required" && (
                  <p className="text-danger">
                    Por favor, insertar correo electrónico.
                  </p>
                )}
                {errors.email?.type === "pattern" && (
                  <p className="text-danger">Formato incorrecto.</p>
                )}
              </div>
              <div className="mb-2">
                <label hidden htmlFor="password">
                  Password:
                </label>
                <input
                  {...register("password", { required: true })}
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  className="form-control p-1 w-100"
                />
                {errors.password?.type === "required" && (
                  <p className="text-danger">Por favor, insertar contraseña.</p>
                )}
              </div>
              <div className="mb-2">
                <label hidden htmlFor="phoneNumber">
                  Número de teléfono:
                </label>
                <input
                  {...register("phoneNumber", { required: true })}
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="Número de teléfono"
                  className="form-control p-1 w-100"
                />{" "}
                {errors.phoneNumber?.type === "required" && (
                  <p className="text-danger">
                    Por favor, insertar número de teléfono.
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div className="mb-2">
                <label hidden htmlFor="address">
                  Dirección:
                </label>
                <input
                  {...register("address", { required: true })}
                  name="address"
                  id="address"
                  placeholder="Dirección"
                  className="form-control p-1 w-100"
                />
                {errors.address?.type === "required" && (
                  <p className="text-danger">Por favor, insertar dirección.</p>
                )}
              </div>

              <div className="row mb-2">
                <div className="col-md-6 mb-2">
                  <CountryDropdown
                    defaultOptionLabel="Seleccionar país"
                    name="country"
                    control={control}
                    value={countrySelector.country}
                    onChange={(val) => {
                      setCountrySelector({
                        ...countrySelector,
                        country: val,
                      });
                      setValue("country", val);
                    }}
                    className="form-control rounded"
                  />

                  {errors.country?.type === "required" && (
                    <p className="text-danger">Por favor, insertar país.</p>
                  )}
                </div>
                <div className="col-md-6">
                  <RegionDropdown
                    name="region"
                    control={control}
                    country={countrySelector.country}
                    value={countrySelector.region}
                    defaultOptionLabel="Seleccionar región"
                    onChange={(val) => {
                      setCountrySelector({
                        ...countrySelector,
                        region: val,
                      });
                      setValue("region", val);
                    }}
                    className="form-control rounded "
                  />
                  {errors.region?.type === "required" && (
                    <p className="text-danger">Por favor, insertar región.</p>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label hidden htmlFor="zipCode">
                  Código postal:
                </label>
                <input
                  name="zipCode"
                  id="zipCode"
                  placeholder="Código postal"
                  className="form-control p-1 w-100"
                  {...register("zipCode", { required: true })}
                />
                {errors.zipCode?.type === "required" && (
                  <p className="text-danger">
                    Por favor, insertar código postal.
                  </p>
                )}
              </div>

              <button className="w-100 mb-2 border-0 p-1 rounded text-white">
                Ingresar
              </button>
            </form>

            <p className="text-center">
              ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión acá.</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
