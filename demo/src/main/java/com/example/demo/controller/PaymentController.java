package com.example.demo.controller;

import com.example.demo.service.RazorpayService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.razorpay.RazorpayException;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private RazorpayService razorpayService;

    @PostMapping("/create-order")
    public String createOrder(@RequestBody Map<String, Object> data) {
        try {
            int amount = (int) data.get("amount");
            String currency = (String) data.get("currency");
            String receiptId = (String) data.get("receipt");

            JSONObject order = razorpayService.createOrder(amount, currency, receiptId);
            return order.toString();
        } catch (RazorpayException e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }

    @PostMapping("/save-payment")
    public String savePayment(@RequestBody Map<String, Object> data) {
        try {
            String name = (String) data.get("name");
            String phoneNumber = (String) data.get("phoneNumber");
            String transactionId = (String) data.get("transactionId");
            int amount = (int) data.get("amount");
            String paymentMode = (String) data.get("paymentMode");

            razorpayService.savePaymentDetails(name, phoneNumber, transactionId, amount, paymentMode);
            return "{\"status\": \"success\"}";
        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }
}
