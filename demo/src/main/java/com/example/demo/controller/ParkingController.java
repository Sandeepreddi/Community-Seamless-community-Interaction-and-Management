package com.example.demo.controller;

import com.example.demo.model.Parking;
import com.example.demo.repository.ParkingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/parking")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from React
public class ParkingController {

    @Autowired
    private ParkingRepository parkingRepository;

    // **Add Parking Spot**
    @PostMapping("/add")
    public ResponseEntity<Parking> addParking(@RequestBody Parking parking) {
        try {
            Parking savedParking = parkingRepository.save(parking);
            return ResponseEntity.ok(savedParking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // **Get All Parking Spots**
    @GetMapping("/all")
    public ResponseEntity<List<Parking>> getAllParking() {
        List<Parking> parkingList = parkingRepository.findAll();
        return ResponseEntity.ok(parkingList);
    }

    // **Update Parking Spot**
    @PutMapping("/update/{id}")
    public ResponseEntity<Parking> updateParking(@PathVariable String id, @RequestBody Parking updatedParking) {
        Optional<Parking> existingParking = parkingRepository.findById(id);

        if (existingParking.isPresent()) {
            Parking parking = existingParking.get();
            parking.setParkingid(updatedParking.getParkingid());
            parking.setFlatNo(updatedParking.getFlatNo());
            parking.setBlock(updatedParking.getBlock());
            parking.setStatus(updatedParking.getStatus());

            Parking savedParking = parkingRepository.save(parking);
            return ResponseEntity.ok(savedParking);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // **Delete Parking Spot**
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteParking(@PathVariable String id) {
        Optional<Parking> parking = parkingRepository.findById(id);
        if (parking.isPresent()) {
            parkingRepository.deleteById(id);
            return ResponseEntity.ok("Parking spot deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Parking spot not found.");
        }
    }
}
