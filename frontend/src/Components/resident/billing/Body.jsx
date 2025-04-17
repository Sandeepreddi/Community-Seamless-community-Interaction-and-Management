import React, { useEffect, useState } from "react";
import './ResidentBilling.css'

const Body = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("email");


  // Fetch user payment details on load
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const res = await fetch(`http://localhost:8080/payments/get-by-email/${email}`);
        const data = await res.json();
        console.log("payment data",data);
        setPaymentDetails(data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    fetchPaymentDetails();
  }, []);

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: paymentDetails.amount * 100, // Razorpay takes amount in paise
          currency: "INR",
          receipt: "receipt_" + Date.now(),
        }),
      });

      const order = await res.json();

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please refresh.");
        return;
      }

      const options = {
        key: "rzp_test_ha9K2euNE9OImQ",
        amount: order.amount,
        currency: order.currency,
        name: "CommUnity",
        description: "Maintenance Payment",
        order_id: order.id,
        handler: async function (response) {
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
          await updatePayment(response.razorpay_payment_id);
        },
        
        theme: { color: "#3399cc" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed.");
    } finally {
      setLoading(false);
      setShowPaymentModal(false);
    }
  };

  const updatePayment = async (transactionId) => {
    try {
      console.log('email at update', email);
      const res = await fetch(`http://localhost:8080/payments/update-payment-by-email/${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: transactionId,
          paymentMode: "Razorpay",
          dateOfPayment: new Date().toISOString(),
          status: "PAID",
        }),
      });
  
      if (res.ok) {
        const updated = await res.json();
        alert("Payment details updated successfully.");
        setPaymentDetails(updated);
      } else {
        const errorData = await res.json();
        console.error("Failed to update payment details:", errorData);
      }
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };
  

  

  return (
    <div className="billing-container">
      <main className="main-content">
        <header className="header">
          <h1>Billings</h1>
          <div className="user-info">
            <span>{paymentDetails?.name || "Loading..."}</span>
            <div className="avatar"></div>
          </div>
        </header>

        <div className="billing-content">
          <div className="bill-card">
            <h2>Maintenance Bill: ₹{paymentDetails?.amount}</h2>
            <p>Status: <strong>{paymentDetails?.status}</strong></p>
            <button
              className="pay-now-btn"
              onClick={handlePayNow}
              disabled={paymentDetails?.status === "PAID"}
            >
              {paymentDetails?.status === "PAID" ? "Paid" : "Pay Now"}
            </button>
          </div>
        </div>
      </main>

      {showPaymentModal && (
        <div className="payment-modal">
          <div className="payment-content">
            <h2>Confirm Your Payment</h2>
            <div className="payment-details">
              <p>Flat: A234</p>
              <p>Receipt: REF{Date.now()}</p>
              <p>Amount: ₹{paymentDetails?.amount}</p>
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
