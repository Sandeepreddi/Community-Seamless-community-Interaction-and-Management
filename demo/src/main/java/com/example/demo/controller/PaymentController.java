package com.example.demo.controller;

import com.example.demo.model.Payment;
import com.example.demo.repository.PaymentRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Order;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    // GET: Fetch all payments
@GetMapping
public Iterable<Payment> getAllPayments() {
    return paymentRepository.findAll();
}

@GetMapping("/get-by-email/{email}")
public ResponseEntity<Payment> getPaymentByEmail(@PathVariable String email) {
    Optional<Payment> payment = paymentRepository.findFirstByEmail(email);
    return payment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
}

@PostMapping("/create-order")
public ResponseEntity<String> createOrder(@RequestBody Map<String, Object> data) {
    try {
        int amount = (int) data.get("amount");
        String currency = (String) data.get("currency");
        String receipt = (String) data.get("receipt");

        RazorpayClient client = new RazorpayClient(apiKey, apiSecret);

        JSONObject options = new JSONObject();
        options.put("amount", amount);
        options.put("currency", currency);
        options.put("receipt", receipt);

        Order order = client.Orders.create(options);
        return ResponseEntity.ok(order.toString());

    } catch (RazorpayException e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
    }
}





    // NEW: Create ₹1000 pending payment using just email
    @PostMapping("/create-pending-payment")
    public String createPendingPayment(@RequestBody Map<String, String> data) {
        try {
            //String email = data.get("email");

            Payment payment = new Payment();
            payment.setName(data.get("name"));  // using 'name' field to save email
            payment.setEmail(data.get("email"));
            payment.setPhoneNumber(data.get("phoneNumber"));
            payment.setStatus(data.get("status"));
            payment.setAmount(Integer.parseInt(data.get("amount")));
            payment.setTransactionId(data.get("transactionId"));
            payment.setPaymentMode(data.get("paymentMode"));
            payment.setDateOfPayment(data.get("dateOfPayment"));

            paymentRepository.save(payment);

            return "{\"status\": \"pending payment created\"}";
        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }


    @PutMapping("/update-payment-by-email/{email}")
public ResponseEntity<String> updatePaymentByEmail(
        @PathVariable String email,  // <-- FIXED
        @RequestBody Map<String, String> data) {

    System.out.println("Received email: " + email);  // Now this will print correctly

    try {
        Optional<Payment> existingPayment = paymentRepository.findByEmail(email);

        if (existingPayment.isPresent()) {
            Payment payment = existingPayment.get();

            // Example updates from the request body
            payment.setTransactionId(data.get("transactionId"));
            payment.setPaymentMode(data.get("paymentMode"));
            payment.setDateOfPayment(data.get("dateOfPayment"));
            payment.setStatus(data.get("status"));
            paymentRepository.save(payment);
            System.out.println("data saved: " + payment);

            return ResponseEntity.ok("{\"status\": \"payment updated successfully\"}");
        } else {
            return ResponseEntity.status(404).body("{\"error\": \"Payment not found for the provided email\"}");
        }
    } catch (Exception e) {
        return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
    }
}




}
