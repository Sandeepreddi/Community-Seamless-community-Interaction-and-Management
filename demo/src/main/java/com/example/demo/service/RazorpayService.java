package com.example.demo.service;


import com.example.demo.model.Payment;
import com.example.demo.repository.PaymentRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;

@Service
public class RazorpayService {

    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    @Autowired
    private PaymentRepository paymentRepository;

    public JSONObject createOrder(int amount, String currency, String receiptId) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(apiKey, apiSecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100); // Convert to paise (Razorpay handles INR in paise)
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", receiptId);
        orderRequest.put("payment_capture", 1); // Auto capture payment

        Order order = razorpayClient.orders.create(orderRequest);
        return new JSONObject(order.toString());
    }

    public void savePaymentDetails(String name, String phoneNumber, String transactionId, int amount, String paymentMode) {
        Payment payment = new Payment(name, phoneNumber, "Success", amount, transactionId, paymentMode, new Date());
        paymentRepository.save(payment);
    }
}
