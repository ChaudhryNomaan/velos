// import React, { createContext, useState, useContext } from 'react';

// const StoreContext = createContext();

// export const StoreProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [isBagOpen, setIsBagOpen] = useState(false);

//   const addToCart = (product) => {
//     setCart(prev => [...prev, product]);
//     setIsBagOpen(true);
//   };

//   const removeFromCart = (id) => {
//     setCart(prev => prev.filter(item => item.id !== id));
//   };

//   const cartTotal = cart.reduce((acc, item) => acc + parseFloat(item.price.replace(',', '')), 0);

//   return (
//     <StoreContext.Provider value={{ cart, addToCart, removeFromCart, isBagOpen, setIsBagOpen, cartTotal }}>
//       {children}
//     </StoreContext.Provider>
//   );
// };

// export const useStore = () => useContext(StoreContext);