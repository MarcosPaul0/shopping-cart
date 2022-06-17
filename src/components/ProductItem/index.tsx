import { MdAddShoppingCart } from "react-icons/md";

interface ProductItemProps {
  title: string;
  price: string;
  amount: number;
  imageUrl: string;
  handleAddProduct: () => void;
}

export function ProductItem({
  title,
  imageUrl,
  price,
  amount,
  handleAddProduct,
}: ProductItemProps) {
  return (
    <li>
      <img src={imageUrl} alt={title} />
      <strong>{title}</strong>
      <span>{price}</span>
      <button
        type="button"
        data-testid="add-product-button"
        onClick={handleAddProduct}
      >
        <div data-testid="cart-product-quantity">
          <MdAddShoppingCart size={16} color="#FFF" />
          {amount || 0}
        </div>

        <span>ADICIONAR AO CARRINHO</span>
      </button>
    </li>
  );
}
