import React from "react";

export default function CheckoutPage({
  total,
  wallet,
  onCheckout,
  loading,
  error,
  success,
}) {
  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Wallet Balance:</strong> $
        {wallet ? (wallet / 100).toFixed(2) : "..."}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Total to Pay:</strong> $
        {total ? (total / 100).toFixed(2) : "..."}
      </div>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      {success && (
        <div style={{ color: "green", marginBottom: 12 }}>{success}</div>
      )}
      <button
        className="button"
        onClick={onCheckout}
        disabled={loading || total > wallet}
      >
        {loading ? "Processing..." : "Confirm & Pay"}
      </button>
      {total > wallet && (
        <div style={{ color: "red", marginTop: 10 }}>
          Insufficient wallet balance.
        </div>
      )}
    </div>
  );
}
