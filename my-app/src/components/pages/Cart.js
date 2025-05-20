import React from "react";
import { Link } from "react-router-dom";
import { 
  FaTrash, FaArrowLeft, FaShoppingBag, FaMinus, 
  FaPlus, FaGift, FaTruck, FaShieldAlt, FaCreditCard,
  FaBox, FaPercent, FaMoneyBillWave
} from "react-icons/fa";
import { useShop } from "../../context/ShopContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal } = useShop();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateCartQuantity(productId, newQuantity);
      toast.success('Cart updated!', {
        position: "top-right",
        autoClose: 200,
      });
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast.info('Item removed from cart', {
      position: "top-right",
      autoClose: 200,
    });
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 200 : 0; // Updated shipping cost to PKR
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + shipping + tax;

  // Format currency in PKR
  const formatPrice = (price) => {
    return `PKR ${price.toLocaleString('en-PK')}`;
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <Link to="/" className="back-btn">
            <FaArrowLeft /> Continue Shopping
          </Link>
          <h2><FaShoppingBag /> Your Shopping Bag</h2>
          <div className="cart-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <FaShoppingBag />
            </div>
            <h3>Your Shopping Bag is Empty</h3>
            <p>Discover our amazing collection and add your favorite items to the cart!</p>
            <Link to="/" className="continue-shopping-btn">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-items-header">
                <h3>Cart Items</h3>
                <p className="items-count">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your bag</p>
              </div>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                    {item.discount > 0 && (
                      <div className="discount-badge">
                        {item.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <div className="item-header">
                      <div className="item-title">
                        <h3>{item.name}</h3>
                      <p className="item-category">{typeof item.category === 'object' ? item.category.name : item.category}</p>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    <div className="item-features">
                      {item.features && item.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                    
                    <div className="price-quantity">
                      <div className="quantity-section">
                        <span className="quantity-label">Quantity:</span>
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn" 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="quantity-btn" 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                      <div className="item-price">
                        <p className="price">{formatPrice(item.price * item.quantity)}</p>
                        {item.discount > 0 && (
                          <p className="original-price">
                            {formatPrice((item.price / (1 - item.discount/100)) * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-item">
                  <span>Shipping Fee</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="summary-item">
                  <span>Tax (5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="summary-item total">
                  <span>Total Amount</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <button className="checkout-btn">
                  <FaMoneyBillWave className="btn-icon" />
                  Proceed to Checkout
                </button>
              </div>

              <div className="cart-features">
                <div className="feature-item">
                  <FaTruck />
                  <div>
                    <h4>Fast Delivery</h4>
                    <p>2-3 business days delivery</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaCreditCard />
                  <div>
                    <h4>Secure Payment</h4>
                    <p>Multiple payment options</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaBox />
                  <div>
                    <h4>Easy Returns</h4>
                    <p>7 days return policy</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaPercent />
                  <div>
                    <h4>Special Offers</h4>
                    <p>Save up to 25% on bulk orders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Cart;
