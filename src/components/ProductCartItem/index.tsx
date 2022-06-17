import {
  MdAddCircleOutline,
  MdDelete,
  MdRemoveCircleOutline,
} from "react-icons/md";

interface ProductCartItemProps {
  title: string;
  amount: number;
  imageUrl: string;
  formattedPrice: string;
  formattedSubtotal: string;
  handleProductIncrement: () => void;
  handleProductDecrement: () => void;
  handleRemoveProduct: () => void;
}

export function ProductCartItem({
  title,
  amount,
  imageUrl,
  formattedPrice,
  formattedSubtotal,
  handleProductIncrement,
  handleProductDecrement,
  handleRemoveProduct,
}: ProductCartItemProps) {
  return (
    <tr data-testid="product">
      <td>
        <img
          src={imageUrl}
          alt={title}
        />
      </td>
      <td>
        <strong>{title}</strong>
        <span>{formattedPrice}</span>
      </td>
      <td>
        <div>
          <button
            type="button"
            data-testid="decrement-product"
            disabled={amount <= 1}
            onClick={handleProductDecrement}
          >
            <MdRemoveCircleOutline size={20} />
          </button>
          <input
            type="text"
            data-testid="product-amount"
            readOnly
            value={amount}
          />
          <button
            type="button"
            data-testid="increment-product"
            onClick={handleProductIncrement}
          >
            <MdAddCircleOutline size={20} />
          </button>
        </div>
      </td>
      <td>
        <strong>{formattedSubtotal}</strong>
      </td>
      <td>
        <button
          type="button"
          data-testid="remove-product"
          onClick={handleRemoveProduct}
        >
          <MdDelete size={20} />
        </button>
      </td>
    </tr>
  );
}
