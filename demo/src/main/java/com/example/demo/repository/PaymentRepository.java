package com.example.demo.repository;

import com.example.demo.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {

    Optional<Payment> findByTransactionId(String transactionId);

    // Find all payments by email
    Optional<Payment> findByEmail(String email);

    // Find a single payment by email (optional)
    Optional<Payment> findFirstByEmail(String email);

    // Find pending payments by email
    List<Payment> findByEmailAndStatus(String email, String status);
}
