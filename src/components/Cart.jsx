// src/components/Cart.jsx

import React from 'react';

const Cart = ({ cartItems, removeFromCart, checkout }) => {
  // Hitung total harga
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart">
      <h2>Keranjang Belanja ({cartItems.length} Item)</h2>
      {cartItems.length === 0 ? (
        <p>Keranjang Anda kosong.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              style={{ 
                border: '1px solid #eee', 
                padding: '10px', 
                margin: '5px 0', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                {item.name} (x{item.quantity}) - Rp{(item.price * item.quantity).toLocaleString('id-ID')}
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{ backgroundColor: 'red', color: 'white' }}>
                Hapus 
              </button>
            </div>
          ))}
          
          <h3 style={{ marginTop: '20px' }}>
            Total: Rp{total.toLocaleString('id-ID')}
          </h3>
          
          <button 
            onClick={checkout} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: 'green', 
              color: 'white', 
              border: 'none', 
              cursor: 'pointer' 
            }}
          >
            Selesaikan Transaksi (Checkout)
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;