import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct;

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );
    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuant) => prevTotalQuant + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;

      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(`${qty} ${product.name} added to the cart`);
  };

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);

    if (value === "inc") {
      const updateItems = cartItems.map((item) => {
        if (item._id === id && value) {
          return { ...item, quantity: foundProduct.quantity + 1 };
        }

        return item;
      });

      setCartItems(updateItems);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQ) => prevTotalQ + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        const updateItems = cartItems.map((item) => {
          if (item._id === id && value) {
            return { ...item, quantity: foundProduct.quantity - 1 };
          }

          return item;
        });

        setCartItems(updateItems);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQ) => prevTotalQ - 1);
      }
    }
  };

  const onRemove = (id) => {
    foundProduct = cartItems.find((item) => item._id === id);

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities((prevTotalQ) => prevTotalQ - foundProduct.quantity);
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  const incQty = () => {
    setQty((prevQtv) => prevQtv + 1);
  };
  const decQty = () => {
    setQty((prevQtv) => {
      if (prevQtv - 1 < 1) return 1;
      return prevQtv - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
