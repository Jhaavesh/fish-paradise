import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { orderAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import './Cart.css';

const INIT_FORM = { name:'', email:'', phone:'', address:'', notes:'' };

const PAYMENT_LABELS = {
  COD: 'Cash on Delivery',
  ONLINE: 'Online Payment',
};

function ensureRazorpayLoaded() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay checkout.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout.'));
    document.body.appendChild(script);
  });
}

export default function Cart() {
  const { items, isOpen, closeCart, removeFromCart, updateQty, clearCart, total, itemCount } = useCart();
  const [checkout,setCheckout]=useState(false);
  const [form,setForm]=useState(INIT_FORM);
  const [placing,setPlacing]=useState(false);
  const [successOrder,setSuccessOrder]=useState(null);
  const [paymentMethod,setPaymentMethod]=useState('COD');
  const [paymentConfig,setPaymentConfig]=useState({ codEnabled: true, onlineEnabled: false, provider: 'razorpay' });
  const [loadingPaymentConfig,setLoadingPaymentConfig]=useState(false);

  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    let active = true;
    setLoadingPaymentConfig(true);
    orderAPI.getPaymentConfig()
      .then(res => {
        if (!active) {
          return;
        }

        const nextConfig = res.data?.data || { codEnabled: true, onlineEnabled: false, provider: 'razorpay' };
        setPaymentConfig(nextConfig);
        setPaymentMethod(current => {
          if (current === 'ONLINE' && !nextConfig.onlineEnabled) {
            return nextConfig.codEnabled ? 'COD' : 'ONLINE';
          }

          if (current === 'COD' && !nextConfig.codEnabled && nextConfig.onlineEnabled) {
            return 'ONLINE';
          }

          return current;
        });
      })
      .catch(() => {
        if (active) {
          setPaymentConfig({ codEnabled: true, onlineEnabled: false, provider: 'razorpay' });
          setPaymentMethod('COD');
        }
      })
      .finally(() => {
        if (active) {
          setLoadingPaymentConfig(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isOpen]);

  const markPaymentFailed = async (orderId, reason) => {
    try {
      await orderAPI.markPaymentFailed({ orderId, reason });
    } catch (error) {
      console.error('Payment failure update error:', error);
    }
  };

  const openRazorpayCheckout = (paymentSession, orderId) => new Promise((resolve, reject) => {
    let settled = false;
    const finalize = (callback) => {
      if (settled) {
        return;
      }

      settled = true;
      callback();
    };

    const razorpay = new window.Razorpay({
      key: paymentSession.keyId,
      amount: paymentSession.amount,
      currency: paymentSession.currency,
      name: 'Fish Paradise',
      description: 'Aquarium supplies order payment',
      order_id: paymentSession.gatewayOrderId,
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        localOrderId: orderId,
        receiptCode: paymentSession.receiptCode,
      },
      theme: { color: '#007cf0' },
      modal: {
        ondismiss: () => {
          markPaymentFailed(orderId, 'Payment popup closed before completion');
          finalize(() => reject(new Error('Payment cancelled before completion.')));
        },
      },
      handler: async (response) => {
        try {
          await orderAPI.verifyPayment({
            orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          finalize(() => resolve(response));
        } catch (error) {
          await markPaymentFailed(orderId, error.message || 'Payment verification failed');
          finalize(() => reject(error));
        }
      },
    });

    razorpay.on('payment.failed', (response) => {
      const reason = response.error?.description || 'Payment failed';
      markPaymentFailed(orderId, reason);
      finalize(() => reject(new Error(reason)));
    });

    razorpay.open();
  });

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      toast.error('Name and email required');
      return;
    }

    if (paymentMethod === 'ONLINE' && !form.phone) {
      toast.error('Phone number is required for online payment');
      return;
    }

    const orderPayload = {
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      address: form.address,
      notes: form.notes,
      paymentMethod,
      items: items.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        imageUrl: item.imageUrl,
      })),
      totalAmount: total,
    };

    let createdOrderId = '';
    let receiptCode = '';
    setPlacing(true);

    try {
      if (paymentMethod === 'ONLINE') {
        await ensureRazorpayLoaded();
      }

      const orderResponse = await orderAPI.create(orderPayload);
      const createdOrder = orderResponse.data?.data;
      createdOrderId = createdOrder?._id || '';
      receiptCode = createdOrder?.receiptCode || '';

      if (paymentMethod === 'ONLINE') {
        const paymentResponse = await orderAPI.createPayment({ orderId: createdOrderId });
        const paymentSession = paymentResponse.data?.data;
        await openRazorpayCheckout(paymentSession, createdOrderId);
        toast.success('Payment successful. Order confirmed!');
      } else {
        toast.success('Order placed!');
      }

      clearCart();
      setSuccessOrder({ paymentMethod, receiptCode });
      setCheckout(false);
      setForm(INIT_FORM);
    } catch (err) {
      if (paymentMethod === 'ONLINE' && createdOrderId) {
        await markPaymentFailed(createdOrderId, err.message || 'Payment did not complete');
      }
      toast.error(err.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if(!isOpen) return null;
  return(<><div className="cart-backdrop" onClick={closeCart}/><div className="cart-drawer">
    <div className="cart-header"><h2><i className="fas fa-shopping-cart"></i> My Cart{itemCount>0&&<span className="cart-count">{itemCount}</span>}</h2><button className="cart-close" onClick={closeCart}><i className="fas fa-times"></i></button></div>
    {successOrder?(<div className="cart-success"><div className="cart-success-icon"><i className="fas fa-check-circle"></i></div><h3>{successOrder.paymentMethod==='ONLINE'?'Payment Successful!':'Order Placed!'}</h3><p>{successOrder.paymentMethod==='ONLINE'?'Your payment was verified and the order is now confirmed.':'We will contact you within 24 hours to confirm delivery details.'}</p>{successOrder.receiptCode&&<div className="cart-order-code">Order Ref: <strong>{successOrder.receiptCode}</strong></div>}<button className="btn-primary" onClick={()=>{setSuccessOrder(null);closeCart();}}>Continue Shopping</button></div>)
    :items.length===0?(<div className="cart-empty"><i className="fas fa-fish"></i><p>Your cart is empty</p><button className="btn-primary" onClick={closeCart}>Browse Products</button></div>)
    :!checkout?(<><div className="cart-items">{items.map(item=>(<div className="cart-item" key={item._id}><img src={item.imageUrl||'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=80&q=70'} alt={item.name}/><div className="cart-item-info"><p className="cart-item-name">{item.name}</p><p className="cart-item-price">Rs.{(item.price*item.qty).toLocaleString('en-IN')}</p><div className="cart-qty"><button onClick={()=>updateQty(item._id,item.qty-1)}>-</button><span>{item.qty}</span><button onClick={()=>updateQty(item._id,item.qty+1)}>+</button></div></div><button className="cart-remove" onClick={()=>removeFromCart(item._id)}><i className="fas fa-trash-alt"></i></button></div>))}</div>
    <div className="cart-footer"><div className="cart-total"><span>Total</span><strong>Rs.{total.toLocaleString('en-IN')}</strong></div><button className="btn-primary cart-checkout" onClick={()=>setCheckout(true)}>Proceed to Checkout <i className="fas fa-arrow-right"></i></button><button className="cart-clear" onClick={clearCart}>Clear cart</button></div></>)
    :(<form className="checkout-form" onSubmit={placeOrder}><div className="checkout-head"><div><h3>Checkout Details</h3><p>Finish your order with COD or pay securely online.</p></div><div className="checkout-method-pill">{PAYMENT_LABELS[paymentMethod]}</div></div>{[['name','text','Full Name *','Your Name'],['email','email','Email *','you@email.com'],['phone','tel',paymentMethod==='ONLINE'?'Phone *':'Phone','+91 98861 98869'],['address','text','Delivery Address','Your full address']].map(([key,type,label,ph])=>(<div className="cf-group" key={key}><label>{label}</label><input type={type} placeholder={ph} value={form[key]} onChange={e=>setF(key,e.target.value)} required={label.includes('*')}/></div>))}<div className="cf-group"><label>Order Notes</label><textarea rows={3} placeholder="Any special instructions..." value={form.notes} onChange={e=>setF('notes',e.target.value)}/></div><div className="payment-options"><label>Payment Method</label><div className="payment-choice-grid"><button type="button" className={"payment-choice" + (paymentMethod==='COD'?' active':'')} onClick={()=>setPaymentMethod('COD')} disabled={!paymentConfig.codEnabled}><span><i className="fas fa-truck"></i>Cash on Delivery</span><small>Pay when your order is confirmed and delivered.</small></button><button type="button" className={"payment-choice" + (paymentMethod==='ONLINE'?' active':'')} onClick={()=>setPaymentMethod('ONLINE')} disabled={!paymentConfig.onlineEnabled || loadingPaymentConfig}><span><i className="fas fa-credit-card"></i>Razorpay Secure Payment</span><small>{paymentConfig.onlineEnabled?'UPI, cards, netbanking, and wallets supported.':'Online payment is not configured yet.'}</small></button></div>{loadingPaymentConfig&&<p className="payment-config-note">Checking payment availability...</p>}</div><div className="checkout-total"><div><span>Total: <strong>Rs.{total.toLocaleString('en-IN')}</strong></span><small>{paymentMethod==='ONLINE'?'You will be redirected to Razorpay checkout.':'COD remains available for this order.'}</small></div><span className={paymentMethod==='ONLINE'?'pay-badge online':'pay-badge cod'}><i className={paymentMethod==='ONLINE'?'fas fa-lock':'fas fa-truck'}></i>{PAYMENT_LABELS[paymentMethod]}</span></div><button type="submit" className="btn-primary cart-checkout" disabled={placing}>{placing?<><i className="fas fa-spinner fa-spin"></i>{paymentMethod==='ONLINE'?' Starting payment...':' Placing...'}</>:<>{paymentMethod==='ONLINE'?'Pay Now':'Place Order'} <i className={paymentMethod==='ONLINE'?'fas fa-arrow-up-right-from-square':'fas fa-check'}></i></>}</button><button type="button" className="cart-clear" onClick={()=>setCheckout(false)}>Back to cart</button></form>)}
  </div></>);
}
