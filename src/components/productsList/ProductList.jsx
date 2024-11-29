import React, { useEffect, useState } from "react";
import ProductCard from "../home/ProductCard";
import axios from "axios";
import "./shop.css";
import { useSearchParams } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryStringCategory = searchParams.get("categoryId");
  const [selectedCategory, setSelectedCategory] = useState(
    queryStringCategory ? queryStringCategory : 0
  );

  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios({
        method: "GET",
        url: `${
          import.meta.env.VITE_API_URL
        }/products?categoryId=${selectedCategory}`,
      });
      setProducts(response.data);
    };
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_API_URL}/categories`,
      });
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowDropdown(true);
  };

  const handleOptionClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setInputValue(
      categories.find((cat) => cat.id === categoryId)?.name || "Mostrar todos"
    );
    setShowDropdown(false);
  };
  return (
    <div>
      <div className="banner-container mt-5 mb-4">
        <img
          src="food-drink-table.jpg"
          alt="banner Product List"
          className="img-fluid"
        />
      </div>

      <div className="text-center mb-4">
        <h2 className="display-4 fw-bold mb-4">Listado de productos</h2>
        <div className="d-flex justify-content-center w-75 select-container position-relative">
          <input
            type="text"
            className="form-control form-control-lg mb-3 shadow"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            placeholder="Filtrar por..."
          />
          {showDropdown && (
            <ul
              className="dropdown-menu show w-100 border-0"
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                position: "absolute",
                zIndex: 1000,
              }}
            >
              <li
                className="dropdown-item fs-5"
                onClick={() => handleOptionClick()}
                key="all-categories"
              >
                Mostrar todos
              </li>
              {categories.map((category) => (
                <li
                  className="dropdown-item fs-5"
                  onClick={() => handleOptionClick(category.id)}
                  key={category.id}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="container">
        <div className="row justify-content-center">
          {products.map((product) => (
            <div key={product.id} className="col-10 col-md-4 col-lg-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
