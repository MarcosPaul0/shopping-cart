import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
// import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const { data: productStock } = await api.get<Stock>(
        `/stock/${productId}`
      );

      const product = cart.find((product) => product.id === productId);

      if (productStock.amount === 0) {
        toast.error("Produto sem estoque");
        return;
      }

      if (!product) {
        const { data: newProductToCart } = await api.get<Product>(
          `/products/${productId}`
        );

        setCart((currentProducts) => [
          ...currentProducts,
          { ...newProductToCart, amount: 1 },
        ]);

        localStorage.setItem(
          "@RocketShoes:cart",
          JSON.stringify([...cart, { ...newProductToCart, amount: 1 }])
        );

        return;
      }

      if (productStock.amount <= product.amount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      setCart((currentProducts) => {
        const newCart = currentProducts.map((product) =>
          product.id === productId
            ? { ...product, amount: product.amount + 1 }
            : product
        );

        localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));

        return newCart;
      });
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const product = cart.find((product) => product.id === productId);

      if (!product) {
        toast.error("Erro na remoção do produto");
        return;
      }

      setCart((currentProducts) => {
        const newCart = currentProducts.filter(
          (product) => product.id !== productId
        );

        localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));

        return newCart;
      });
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    if (amount < 1) {
      return;
    }

    try {
      const { data: productStock } = await api.get<Stock>(
        `/stock/${productId}`
      );

      if (productStock.amount === 0) {
        toast.error("Produto sem estoque");
        return;
      }

      if (productStock.amount < amount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      setCart((currentProducts) => {
        const newCart = currentProducts.map((product) =>
          product.id === productId ? { ...product, amount: amount } : product
        );

        localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));

        return newCart;
      });
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
