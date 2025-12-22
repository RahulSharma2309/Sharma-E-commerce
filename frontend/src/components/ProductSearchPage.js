import React, { useState } from "react";
import ProductList from "./ProductList";

export default function ProductSearchPage({ products, onAdd }) {
  const [query, setQuery] = useState("");
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(query.toLowerCase()))
  );
  // Wrap onAdd to accept quantity
  const handleAdd = (product, qty) => onAdd(product, qty);
  return (
    <div className="product-search-page">
      <h2>Shop Products</h2>
      <input
        className="search-bar"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: 18, width: "100%", maxWidth: 400 }}
      />
      <ProductList products={filtered} onAdd={handleAdd} />
    </div>
  );
}
