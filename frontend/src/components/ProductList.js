import React, { useState } from "react";

export default function ProductList({ products, onAdd }) {
  const [quantities, setQuantities] = useState({});

  const handleQtyChange = (id, value, max) => {
    const qty = Math.max(1, Math.min(Number(value) || 1, max));
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  return (
    <div>
      <h3>Products</h3>
      <div className="products">
        {products.map((p) => (
          <div className="product" key={p.id}>
            <div>
              <strong>{p.name}</strong>
            </div>
            <div>{p.description}</div>
            <div>Price: ${(p.price / 100).toFixed(2)}</div>
            <div>Stock: {p.stock}</div>
            <div style={{ margin: "8px 0" }}>
              <input
                type="number"
                min={1}
                max={p.stock}
                value={quantities[p.id] || 1}
                onChange={(e) => handleQtyChange(p.id, e.target.value, p.stock)}
                style={{ width: 60, marginRight: 8 }}
                disabled={p.stock <= 0}
              />
              <button
                className={`button ${p.stock <= 0 ? "disabled" : ""}`}
                onClick={() =>
                  onAdd(
                    { id: p.id, name: p.name, price: p.price },
                    quantities[p.id] || 1
                  )
                }
                disabled={p.stock <= 0}
              >
                {p.stock > 0 ? "Add to cart" : "Out of stock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
