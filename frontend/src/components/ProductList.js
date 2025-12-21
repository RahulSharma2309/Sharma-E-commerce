import React from 'react';

export default function ProductList({ products, onAdd }) {
  return (
    <div>
      <h3>Products</h3>
      <div className="products">
        {products.map(p => (
          <div className="product" key={p.id}>
            <div><strong>{p.name}</strong></div>
            <div>{p.description}</div>
            <div>Price: ${(p.price/100).toFixed(2)}</div>
            <div>Stock: {p.stock}</div>
            <div>
              <button className={`button ${p.stock <= 0 ? 'disabled':''}`} onClick={() => onAdd({ id: p.id, name:p.name, price: p.price })} disabled={p.stock <= 0}>
                {p.stock > 0 ? 'Add to cart' : 'Out of stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
