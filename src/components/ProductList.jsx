// src/components/ProductList.jsx

import React from 'react';

const ProductList = ({ products, addToCart }) => {
  return (
    <div className="product-list">
      <h2>Produk Tersedia</h2>
      {products.map((product) => (
        <div 
          key={product.id} 
          style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            margin: '10px 0', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <strong>{product.name}</strong> - Rp{product.price.toLocaleString('id-ID')}
          </div>
          <button onClick={() => addToCart(product)}>
            Tambah ke Keranjang
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;