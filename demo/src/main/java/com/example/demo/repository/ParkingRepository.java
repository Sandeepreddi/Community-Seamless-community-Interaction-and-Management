package com.example.demo.repository;

import com.example.demo.model.Parking;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

public interface ParkingRepository extends MongoRepository<Parking, String> {
    Optional<Parking> findById(String id);
    
}