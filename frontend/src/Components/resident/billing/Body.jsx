import React, { useState } from "react";

const Body = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 3500,
          currency: "INR",
          receipt: "receipt_" + Date.now(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const order = await res.json();

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      const options = {
        key: "rzp_test_ha9K2euNE9OImQ", // Replace with your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: "CommUnity",
        description: "Monthly Maintenance Payment",
        order_id: order.id,
        handler: async function (response) {
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
          await savePaymentDetails(order.amount, response);
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
      setShowPaymentModal(false);
    }
  };

  const savePaymentDetails = async (amount, response) => {
    try {
      const res = await fetch("http://localhost:8080/api/payments/save-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Pavani",
          phoneNumber: "9876543210",
          amount: amount / 100, // Razorpay amount is in paise
          transactionId: response.razorpay_payment_id,
          paymentMode: "Razorpay",
        }),
      });

      if (!res.ok) {
        console.error("Failed to save payment");
      }
    } catch (error) {
      console.error("Error saving payment details:", error);
    }
  };

  return (
    <div className="billing-container">
      <main className="main-content">
        <header className="header">
          <h1>Billings</h1>
          <div className="user-info">
            <span>Pavani</span>
            <div className="avatar"></div>
          </div>
        </header>

        <div className="billing-content">
          <div className="bill-card">
            <h2>Monthly Maintenance Bill: 3500/-</h2>
            <button className="pay-now-btn" onClick={handlePayNow}>
              Pay Now
            </button>
          </div>
        </div>
      </main>

      {showPaymentModal && (
        <div className="payment-modal">
          <div className="payment-content">
            <h2>Payment Request from CommUnity</h2>
            <div className="payment-details">
              <p>PAYMENT FOR</p>
              <p>Maintenance bill for flat A234</p>
              <p>RECEIPT</p>
              <p>REF{Date.now()}</p>
              <p>AMOUNT PAYABLE</p>
              <p className="amount">INR 3,500.00</p>
            </div>
            <button className="continue-btn" onClick={handlePayment}>
              {loading ? "Processing..." : "Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Body;
