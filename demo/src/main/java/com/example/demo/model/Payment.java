package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "payments")
public class Payment {
    @Id
    private String id;
    private String email;

    private String name;
    private String phoneNumber;
    private String status; // e.g., "PENDING", "SUCCESS"
    private int amount;
    private String transactionId;
    private String paymentMode;
    private String dateOfPayment;

    public Payment() {}

    public Payment(String name,String email, String phoneNumber, String status, int amount, String transactionId, String paymentMode, String dateOfPayment) {
        this.email=email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.status = status;
        this.amount = amount;
        this.transactionId = transactionId;
        this.paymentMode = paymentMode;
        this.dateOfPayment = dateOfPayment;
    }
    
    public Payment(String name, String phoneNumber, String status, int amount, String transactionId, String paymentMode, String dateOfPayment) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.status = status;
        this.amount = amount;
        this.transactionId = transactionId;
        this.paymentMode = paymentMode;
        this.dateOfPayment = dateOfPayment;
    }
    

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getAmount() { return amount; }
    public void setAmount(int amount) { this.amount = amount; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getDateOfPayment() { return dateOfPayment; }
    public void setDateOfPayment(String dateOfPayment) { this.dateOfPayment = dateOfPayment; }
}
