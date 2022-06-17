import { useState, useEffect } from "react";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";
import { ProductItem } from "../../components/ProductItem";
// import { ToastContainer } from "react-toastify";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    return { ...sumAmount, [product.id]: product.amount };
  }, {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get<Product[]>("products");

      const allProducts = response.data.map((product: Product) => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));

      setProducts(allProducts);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map((product) => (
        <ProductItem
          key={product.id}
          title={product.title}
          imageUrl={product.image}
          price={product.priceFormatted}
          amount={cartItemsAmount[product.id]}
          handleAddProduct={() => handleAddProduct(product.id)}
        />
      ))}
    </ProductList>
  );
};

export default Home;
