import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

function Order({ order }) {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleToastify = () => {
    toast.warning("Elemento en desarrollo", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <div className="container p-3 mb-3 data-card rounded">
        <div className="row align-items-center">
          <div className="col-12 col-md-3 text-center text-md-start mb-3 mb-md-0">
            <img
              src={`${import.meta.env.VITE_SUPABASE_BUCKET_URL}/${
                order.items[0].image
              }`}
              alt="Imagen de un producto de la orden."
              style={{
                width: "100%",
                height: "130px",
                objectFit: "cover",
              }}
              className="rounded"
            />
          </div>

          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <div className="text-center text-md-start mb-3 d-md-flex">
              <h5 className="fw-bold mb-0 fs-3 text-color me-3">
                Identificador:
              </h5>
              <h5 className="mb-3 fs-3 text-color">{order.orderNumber}</h5>
            </div>

            <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
              <div className="mb-3 me-4 text-md-start">
                <h6 className="mb-1 fs-5 fw-bold text-color">Precio total:</h6>
                <p className="mb-0 fs-5 text-color-units">
                  $
                  {order.items?.reduce(
                    (acc, item) => acc + item.price * item.qty,
                    0
                  ) + 200}
                </p>
              </div>
              <div className="mb-3 ms-md-3 text-md-start">
                <h6 className="mb-1 fs-5 fw-bold text-color">Estado:</h6>
                <p className="mb-0 fs-5 text-color-units">{order.status}</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-3 text-md-end">
            <Link to="">
              <button
                className="rounded px-4 w-100 mb-2"
                onClick={handleToastify}
              >
                Comprar de nuevo
              </button>
            </Link>
            <button
              className="not-action-color rounded w-100"
              onClick={handleShowModal}
            >
              Ver más detalles
            </button>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="border">
          <Modal.Title className="fw-bold ms-2">
            Identificador: <span className="">{order.orderNumber}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-2">
          <div className="mb-2">
            <div className="d-flex justify-content-between">
              <h6 className="text-muted">Fecha de compra:</h6>
              <p className="fw-semibold mb-0">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="d-flex justify-content-between">
              <h6 className="text-muted">Estado:</h6>
              <p className="fw-semibold mb-0">{order.status}</p>
            </div>
            <div className="d-flex justify-content-between">
              <h6 className="text-muted">Cantidad de ítems:</h6>
              <p className="fw-semibold mb-0">{order.items.length}</p>
            </div>
            <div className="d-flex justify-content-between">
              <h6 className="text-muted">Costo de envío:</h6>
              <p className="fw-semibold mb-0">$200</p>
            </div>
          </div>
          <div className="border-top pt-2">
            <h5 className="fw-bold mb-2">Items:</h5>
            <ul className="list-unstyled">
              {order.items?.map((item, index) => (
                <li key={index} className="d-flex align-items-center mb-3">
                  <img
                    src={`${import.meta.env.VITE_SUPABASE_BUCKET_URL}/${
                      item.image
                    }`}
                    alt={item.name}
                    className="rounded me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="flex-grow-1">
                    <p className="fw-semibold mb-1">
                      {item.name} x{item.qty}
                    </p>
                    <p className="text-muted small mb-0">${item.price} c/u</p>
                  </div>
                  <p className="fw-bold mb-0 text-end">
                    ${item.price * item.qty}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-top d-flex justify-content-between pt-2">
            <h5 className="fw-bold">Precio Total:</h5>
            <h5 className="fw-bold total-price">
              $
              {order.items?.reduce(
                (acc, item) => acc + item.price * item.qty,
                0
              ) + 200}
            </h5>
          </div>
        </Modal.Body>
        <Modal.Footer className="border p-2">
          <button onClick={handleCloseModal} className="rounded">
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Order;
