import React, { useEffect, useState } from 'react';
import './AdminBilling.css'

function Body() {
  const [residents, setResidents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("PAID"); // or "PENDING"

  useEffect(() => {
    const today = new Date();
    // const isFirstDayOfMonth = today.getDate() === 1;
    const isFirstDayOfMonth = false;

    fetch('http://localhost:8080/residents')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch residents');
        return response.json();
      })
      .then(data => {
        setResidents(data);
        setLoading(false);

        if (isFirstDayOfMonth) {
          
          data.forEach(resident => {
            const paymentData = {
              name: resident.name,
              email:resident.email,
              phoneNumber: resident.phone_number,
              status: "PENDING",
              amount: 10000,
              transactionId: "",
              paymentMode: "",
              dateOfPayment: ""
            };
            console.log("PaymentData",paymentData);

            fetch('http://localhost:8080/payments/create-pending-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(paymentData),
            })
              .then(res => {
                if (!res.ok) throw new Error('Failed to post payment');
                return res.json();
              })
              .then(response => {
                console.log('Payment posted for:', resident.name);
              })
              .catch(error => {
                console.error('Error posting payment:', error.message);
              });
          });
        }
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });

    // Fetch all payments
    fetch('http://localhost:8080/payments')
      .then(res => res.json())
      .then(data => {
        setPayments(data);
      })
      .catch(err => console.error("Payment fetch error", err));
  }, []);

  const filteredPayments = payments.filter(p => p.status === view);

  return (
    <div className="billings-section">
  <h2 className="billing-heading">Payment Status of the Residents</h2>

  <div className="view-buttons">
    <button onClick={() => setView("PAID")}>Paid</button>
    <button onClick={() => setView("PENDING")}>Unpaid</button>
  </div>

  <table className="billing-table">
    <thead>
      <tr>
        <th>No</th>
        <th>Name</th>
        <th>Mobile No</th>
        <th>Amount</th>
        <th>Date</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {filteredPayments.length === 0 ? (
        <tr><td colSpan={6}>No {view.toLowerCase()} payments available</td></tr>
      ) : (
        filteredPayments.map((payment, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{payment.name}</td>
            <td>{payment.phoneNumber}</td>
            <td>₹{payment.amount}</td>
            <td>
              {payment.dateOfPayment
                ? new Date(payment.dateOfPayment).toLocaleDateString()
                : "-"}
            </td>
            <td className={payment.status === "PAID" ? "billing-status-paid" : "billing-status-pending"}>
              {payment.status}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

  );
}


export default Body;
