import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import axios from "axios";
import OrderModal from "../user/OrderModal";
import "./cart.css";
import { emptyCart } from "../../redux/cartSlice";
import { useForm } from "react-hook-form";

function CheckOut() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [countrySelector, setCountrySelector] = useState({
    country: "Uruguay",
    region: "Maldonado",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingCost = 200;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (!user.token) return navigate("/login");
  }, [user]);
  const contactInfo = {
    firstname: user.firstname,
    lastname: user.lastname,
    phoneNumber: user.phoneNumber,
    email: user.email,
  };
  const shippingInfo = {
    address: user.address,
    zipCode: user.zipCode,
    country: user.country,
    region: user.region,
  };
  const { firstname, lastname, phoneNumber, email } = contactInfo;
  const { address, zipCode, country, region } = shippingInfo;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname,
      lastname,
      phoneNumber,
      email,
      address,
      zipCode,
      country,
      region,
    },
  });

  const onSubmit = async (data) => {
    setIsProcessing(true);
    setIsConfirmed(false);

    const order = {
      contactInfo,
      shippingInfo,
      paymentInfo,
      cart,
      total,
    };
    try {
      await axios({
        method: "POST",
        url: `${import.meta.env.VITE_API_URL}/orders`,
        data: order,
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTimeout(() => {
        setIsProcessing(false);
        setIsConfirmed(true);
        dispatch(emptyCart());
      }, 4000);
    } catch (error) {
      setIsProcessing(false);
      console.error("Error procesando la orden:", error);
    }
  };
  return (
    <div className="carrito-view p-3 min-vh-100">
      <div className="container-fluid d-flex justify-content-center align-items-center">
        <OrderModal isProcessing={isProcessing} isConfirmed={isConfirmed} />
        <div className="card-style rounded carrito-bg-color shadow col-lg-6 col-md-8 col-11 ">
          <div className="position-relative">
            <Link to="/carrito" className="position-absolute pt-2 start-0 mb-3">
              <i className="bi bi-arrow-left ms-3 text-color"></i>
            </Link>
            <div className="text-center line-border py-1">
              <h1 className=" fs-md-4 orders-title">Resumen de compra</h1>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="line-border px-4 py-4">
              <h4 className="fs-6 fs-md-5 text-color">
                Información de contacto
              </h4>
              <div className="row">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3 rounded checkout-input text-color"
                    placeholder="Nombre"
                    {...register("firstname", { required: true })}
                  />
                  {errors.firstname?.type === "required" && (
                    <p className="error-color">Por favor, insertar nombre.</p>
                  )}
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3 checkout-input rounded text-color"
                    placeholder="Apellido"
                    {...register("lastname", { required: true })}
                  />
                  {errors.lastname?.type === "required" && (
                    <p className="error-color">Por favor, insertar apellido.</p>
                  )}
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3 checkout-input rounded text-color"
                    placeholder="Número de teléfono"
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
                  <input
                    type="email"
                    className="form-control mb-3 checkout-input rounded text-color"
                    placeholder="Correo electrónico"
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
              </div>
            </div>

            {/* Información de envío */}
            <div className="line-border px-4 py-4">
              <h4 className="fs-6 fs-md-5 text-color">Información de envío</h4>
              <div className="row">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3 checkout-input rounded text-color"
                    placeholder="Dirección"
                    {...register("address", { required: true })}
                  />
                  {errors.address?.type === "required" && (
                    <p className="error-color">
                      Por favor, insertar dirección.
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3 checkout-input rounded text-color"
                    placeholder="Código postal"
                    {...register("zipCode", { required: true })}
                  />
                  {errors.zipCode?.type === "required" && (
                    <p className="error-color">
                      Por favor, insertar código postal.
                    </p>
                  )}
                </div>
                <div className="col-md-6">
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
                    className="form-control mb-3 checkout-input rounded text-color"
                  />

                  {errors.country?.type === "required" && (
                    <p className="error-color">Por favor, insertar país.</p>
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
                    className="form-control mb-3 checkout-input rounded text-color"
                  />
                  {errors.region?.type === "required" && (
                    <p className="error-color">Por favor, insertar región.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="line-border px-4 py-4">
              <h4 className="fs-6 fs-md-5 text-color">Método de pago</h4>
              <div className="row">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3 checkout-input rounded text-color"
                    placeholder="Número de tarjeta"
                    {...register("cardNumber", {
                      required: true,
                      minLength: 13,
                      maxLength: 18,
                    })}
                  />
                  {errors.cardNumber?.type === "required" && (
                    <p className="error-color">
                      Por favor, insertar número de tarjeta.
                    </p>
                  )}
                  {errors.cardNumber?.type === "minLength" && (
                    <p className="error-color">
                      El número de tarjeta debe tener al menos 13 caracteres.
                    </p>
                  )}
                  {errors.cardNumber?.type === "maxLength" && (
                    <p className="error-color">
                      El número de tarjeta no puede tener más de 18 caracteres.
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3 checkout-input rounded text-color"
                    placeholder="Fecha de expiración (MM/AA)"
                    {...register("expDate", {
                      required: true,
                      pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
                    })}
                  />
                  {errors.expDate?.type === "required" && (
                    <p className="error-color">
                      Por favor, insertar fecha de expiración.
                    </p>
                  )}
                  {errors.expDate?.type === "pattern" && (
                    <p className="error-color">Formato incorrecto.</p>
                  )}
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3 checkout-input rounded text-color"
                    placeholder="cvv"
                    {...register("cvv", {
                      required: true,
                      minLength: 3,
                      maxLength: 3,
                    })}
                  />
                  {errors.cvv?.type === "required" && (
                    <p className="error-color">Por favor, insertar cvv.</p>
                  )}
                  {errors.cvv?.type === "minLength" && (
                    <p className="error-color">
                      El cvv debe tener al menos 3 caracteres.
                    </p>
                  )}
                  {errors.cvv?.type === "maxLength" && (
                    <p className="error-color">
                      El cvv no puede tener más de 3 caracteres.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-4 py-4">
              <div className="d-flex justify-content-between">
                <h6 className="fw-bold text-color">Subtotal:</h6>
                <h6 className="text-color">${subtotal}</h6>
              </div>
              <div className="d-flex justify-content-between">
                <h6 className="fw-bold text-color">Costo de envío:</h6>
                <h6 className="text-color">${shippingCost}</h6>
              </div>
              <div className="d-flex justify-content-between">
                <h6 className="fw-bold text-color">Total a pagar:</h6>
                <h6 className="text-color">${total}</h6>
              </div>
            </div>

            {/* Botón de compra */}
            <div className="px-4 py-3">
              <button
                type="submit"
                className="checkout-btn rounded px-3 w-100 py-2"
              >
                Finalizar la compra
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
