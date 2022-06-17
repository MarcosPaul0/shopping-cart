import { ProductCartItem } from "../../components/ProductCartItem";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../util/format";
import { Container, ProductTable, Total } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map((product) => {
    const formattedPrice = formatPrice(product.price);

    const subtotal = product.price * product.amount;
    const formattedSubtotal = formatPrice(subtotal);

    return (
      <ProductCartItem
        key={product.id}
        title={product.title}
        imageUrl={product.image}
        amount={product.amount}
        formattedPrice={formattedPrice}
        formattedSubtotal={formattedSubtotal}
        handleProductIncrement={() => handleProductIncrement(product)}
        handleProductDecrement={() => handleProductDecrement(product)}
        handleRemoveProduct={() => handleRemoveProduct(product.id)}
      />
    );
  });
  const total = formatPrice(
    cart.reduce(
      (sumTotal, product) => sumTotal + product.price * product.amount,
      0
    )
  );

  function handleProductIncrement(product: Product) {
    updateProductAmount({
      productId: product.id,
      amount: product.amount + 1,
    });
  }

  function handleProductDecrement(product: Product) {
    updateProductAmount({
      productId: product.id,
      amount: product.amount - 1,
    })
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>{cartFormatted}</tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
