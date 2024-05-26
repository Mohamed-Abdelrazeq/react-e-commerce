import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import cartAddWithCollision from "../utils/cartAddWithCollision";
import cartRemoveItem from "../utils/cartRemoveItem";

const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],

      addCartItem: ({ cartItem }) => {
        set((state) => {
          console.log(state.cartItems);

          return { cartItems: cartAddWithCollision(cartItem, state.cartItems) };
        });
      },
      updateCartItem: ({ cartItem }) => {
        set((state) => {
          return {
            cartItems: [...cartRemoveItem(cartItem, state.cartItems), cartItem],
          };
        });
      },
      deleteCartItem: ({ cartItem }) => {
        set((state) => ({
          cartItems: cartRemoveItem(cartItem, state.cartItems),
        }));
      },
      setCartItems: (cartItems) => {
        set(() => ({
          cartItems: cartItems,
        }));
      },
      clearCartItems: () => {
        set(() => ({
          cartItems: [],
        }));
      },
    }),
    { name: "cart-store", storage: createJSONStorage(() => sessionStorage) }
  )
);

export default useCartStore;
