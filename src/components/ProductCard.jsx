import { ShoppingCart, ArrowUpRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
  console.log("ADD CLICKED:", product);
  addToCart(product);
};

  return (
    <div className="product-card">

      <div className="product-image">

        <img
          src={product.image}
          alt={product.name}
        />

        <Link
  to={`/product/${product.id}`}
  className="quick-view"
>
  <ArrowUpRight size={18} />
</Link>

      </div>

      <div className="product-info">

        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <p>{product.description}</p>

        <div className="product-bottom">

          <div>
            <small>Starting from</small>

            <strong>
              ₹{product.price}
            </strong>
          </div>

          <button
            className="add-cart"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} />
            Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;