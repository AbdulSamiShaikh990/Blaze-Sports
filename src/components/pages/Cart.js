import React, { useState } from "react";
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
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useShop();
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash'
  });
  
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

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
                    <img 
                      src={item.image ? `http://localhost:5000${item.image}` : '/placeholder-image.jpg'} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }} 
                    />
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
                <button className="checkout-btn" onClick={() => {
                    if (cart.length === 0) {
                      toast.error('Your cart is empty!', {
                        position: "top-right",
                        autoClose: 1000,
                      });
                      return;
                    }
                    // Show checkout form first
                    setOrderSummary({
                      subtotal,
                      shipping,
                      tax,
                      total
                    });
                    setShowCheckoutForm(true);
                  }}>
                  <FaMoneyBillWave className="btn-icon" />
                  PROCEED TO CHECKOUT
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
      
      {showCheckoutForm && (
        <div className="receipt-overlay" onClick={() => setShowCheckoutForm(false)}>
          <div className="checkout-form" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-header">
              <h2>Checkout Information</h2>
              <p>Please provide your details to complete the order</p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              // Save current cart before clearing
              setCompletedOrder([...cart]);
              setShowCheckoutForm(false);
              setShowReceipt(true);
              // Clear the cart
              clearCart();
              toast.success('Order placed successfully!', {
                position: "top-right",
                autoClose: 1000,
              });
            }}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={orderDetails.name}
                  onChange={(e) => setOrderDetails({...orderDetails, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    required
                    value={orderDetails.email}
                    onChange={(e) => setOrderDetails({...orderDetails, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    required
                    value={orderDetails.phone}
                    onChange={(e) => setOrderDetails({...orderDetails, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Delivery Address</label>
                <textarea 
                  id="address" 
                  required
                  value={orderDetails.address}
                  onChange={(e) => setOrderDetails({...orderDetails, address: e.target.value})}
                  placeholder="Enter your complete address"
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    required
                    value={orderDetails.city}
                    onChange={(e) => setOrderDetails({...orderDetails, city: e.target.value})}
                    placeholder="Enter your city"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input 
                    type="text" 
                    id="postalCode" 
                    required
                    value={orderDetails.postalCode}
                    onChange={(e) => setOrderDetails({...orderDetails, postalCode: e.target.value})}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-options">
                  <label className="payment-option">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cash" 
                      checked={orderDetails.paymentMethod === 'cash'}
                      onChange={() => setOrderDetails({...orderDetails, paymentMethod: 'cash'})}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="payment-option">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="bank" 
                      checked={orderDetails.paymentMethod === 'bank'}
                      onChange={() => setOrderDetails({...orderDetails, paymentMethod: 'bank'})}
                    />
                    <span>Bank Transfer</span>
                  </label>
                </div>
              </div>
              
              <div className="checkout-summary">
                <h3>Order Summary</h3>
                <div className="summary-line">
                  <span>Subtotal:</span>
                  <span>{formatPrice(orderSummary.subtotal)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping:</span>
                  <span>{formatPrice(orderSummary.shipping)}</span>
                </div>
                <div className="summary-line">
                  <span>Tax (5%):</span>
                  <span>{formatPrice(orderSummary.tax)}</span>
                </div>
                <div className="summary-line total">
                  <span>Total:</span>
                  <span>{formatPrice(orderSummary.total)}</span>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowCheckoutForm(false)}>Cancel</button>
                <button type="submit" className="place-order-btn">Place Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showReceipt && completedOrder && (
        <div className="receipt-overlay" onClick={() => setShowReceipt(false)}>
          <div className="receipt" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-header">
              <h2>Blaze Sports</h2>
              <p>Order Receipt</p>
              <p className="receipt-date">{new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="customer-info">
              <h3>Customer Details</h3>
              <p><strong>Name:</strong> {orderDetails.name}</p>
              <p><strong>Address:</strong> {orderDetails.address}, {orderDetails.city}, {orderDetails.postalCode}</p>
              <p><strong>Contact:</strong> {orderDetails.phone}</p>
              <p><strong>Payment Method:</strong> {orderDetails.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
            </div>
            
            <div className="receipt-items">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrder.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price)}</td>
                      <td>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="receipt-summary">
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>{formatPrice(orderSummary.subtotal)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping Fee:</span>
                <span>{formatPrice(orderSummary.shipping)}</span>
              </div>
              <div className="summary-line">
                <span>Tax (5%):</span>
                <span>{formatPrice(orderSummary.tax)}</span>
              </div>
              <div className="summary-line total">
                <span>Total Amount:</span>
                <span>{formatPrice(orderSummary.total)}</span>
              </div>
            </div>
            
            <div className="receipt-footer">
              <p>Thank you for shopping with Blaze Sports!</p>
              <p>For any queries, contact us at support@blazesports.com</p>
              <button className="close-receipt" onClick={() => setShowReceipt(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
