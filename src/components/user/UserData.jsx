import React, { useEffect, useState } from "react";
import "./user.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { logOut } from "../../redux/userSlice";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useForm } from "react-hook-form";

function UserData() {
  const [userInfo, setUserInfo] = useState({});
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [countrySelector, setCountrySelector] = useState({
    country: "Uruguay",
    region: "Maldonado",
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
      email: user.email,
      address: user.address,
      zipCode: user.zipCode,
      country: user.country,
      region: user.region,
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (!user.token) navigate("/login");
    const fetchUser = async () => {
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_API_URL}/users/${user.userId}`,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUserInfo(response.data);
    };
    fetchUser();
  }, []);
  const onSubmit = async (data) => {
    const response = await axios({
      method: "PATCH",
      url: `${import.meta.env.VITE_API_URL}/users/${user.userId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      data: userInfo,
    });

    navigate("/usuario");
  };
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  const handleDeleteUser = async () => {
    const response = await axios({
      method: "DELETE",
      url: `${import.meta.env.VITE_API_URL}/users/${user.userId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    handleLogout();
  };
  const handleSweetAlert = () => {
    Swal.fire({
      title: "¿Seguro/a que quieres eliminar tu usuario?",
      text: "Esta acción no se podrá revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d48c55",
      cancelButtonColor: "#d65a31",
      confirmButtonText: "Sí, eliminar.",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteUser(user);
        Swal.fire({
          title: "Usuario eliminado.",
          text: "Su usuario ha sido eliminado exitosamente.",
          icon: "success",
          confirmButtonColor: "#d65a31",
        });
      }
    });
  };

  return (
    <div className="profile-bg mt-4 p-4 min-vh-100">
      <div className="container mb-4 mt-3 rounded">
        <div className="text-center">
          <h1 className="mb-2 orders-title">Perfil del usuario</h1>
        </div>
        <div className="rounded data-card pt-4 pb-1 px-3 shadow mb-2">
          <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <label
                  htmlFor="firstName"
                  className="form-label fs-5 fw-bold text-color"
                >
                  Nombre:
                </label>
                <input
                  type="text"
                  id="firstname"
                  className="form-control data-card-input rounded fs-5 text-color-units"
                  {...register("firstname", { required: true })}
                />
                {errors.firstname?.type === "required" && (
                  <p className="error-color">Por favor, insertar nombre.</p>
                )}
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="lastName"
                  className="form-label fs-5 fw-bold text-color"
                >
                  Apellido:
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control data-card-input rounded fs-5 text-color-units"
                  {...register("lastname", { required: true })}
                />
                {errors.lastname?.type === "required" && (
                  <p className="error-color">Por favor, insertar apellido.</p>
                )}
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="email"
                  className="form-label fs-5 fw-bold text-color"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control data-card-input rounded fs-5 text-color-units"
                  {...register("email", {
                    required: true,
                    pattern: /([\w\.]+)@([\w\.]+)\.(\w+)/gi,
                  })}
                />
                {errors.email?.type === "required" && (
                  <p className="error-color">
                    Por favor, insertar correo electrónico.
                  </p>
                )}
                {errors.email?.type === "pattern" && (
                  <p className="error-color">Formato incorrecto.</p>
                )}
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="phone"
                  className="form-label fs-5 fw-bold text-color"
                >
                  Número de teléfono:
                </label>
                <input
                  type="text"
                  id="phone"
                  className="form-control data-card-input rounded fs-5 text-color-units"
                  {...register("phoneNumber", { required: true })}
                />
                {errors.phoneNumber?.type === "required" && (
                  <p className="error-color">
                    Por favor, insertar número de teléfono.
                  </p>
                )}
                {errors.phoneNumber?.type === "pattern" && (
                  <p className="error-color">Formato incorrecto.</p>
                )}
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="address"
                  className="form-label fs-5 fw-bold text-color"
                >
                  Dirección:
                </label>
                <input
                  type="text"
                  id="address"
                  className="form-control data-card-input rounded fs-5 text-color-units"
                  {...register("address", { required: true })}
                />
                {errors.address?.type === "required" && (
                  <p className="error-color">Por favor, insertar dirección.</p>
                )}
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="zipCode"
                  className="form-label fs-5 fw-bold text-color"
                >
                  Código postal:
                </label>
                <input
                  type="text"
                  id="zipCode"
                  className="form-control data-card-input rounded fs-5 text-color-units"
                  {...register("zipCode", { required: true })}
                />
                {errors.zipCode?.type === "required" && (
                  <p className="error-color">
                    Por favor, insertar código postal.
                  </p>
                )}
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="country"
                  className="form-label fs-5 fw-bold text-color"
                >
                  País:
                </label>
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
                  className="form-control rounded data-card-input text-color p-2 fs-5"
                />
                {errors.country?.type === "required" && (
                  <p className="error-color">Por favor, insertar país.</p>
                )}
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="zipCode"
                  className="form-label fs-5 fw-bold text-color"
                >
                  Región:
                </label>
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
                  className="form-control rounded data-card-input text-color p-2 fs-5 mb-2"
                />
                {errors.region?.type === "required" && (
                  <p className="error-color">Por favor, insertar región.</p>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <Link to="/usuario">
                <button
                  type="button"
                  className="rounded p-2 not-action-color me-3"
                >
                  Cancelar
                </button>
              </Link>
              <button type="submit" className="rounded p-2">
                Confirmar
              </button>
            </div>
          </form>
        </div>
        <div className="mb-2">
          <button
            className="rounded data-card btn text-color border"
            onClick={handleSweetAlert}
          >
            <i className="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserData;
