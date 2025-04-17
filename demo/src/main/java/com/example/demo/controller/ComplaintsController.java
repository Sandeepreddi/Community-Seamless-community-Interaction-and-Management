package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Optional;

import com.example.demo.model.Complaints;
import com.example.demo.repository.ComplaintsRepository;

@RestController
@RequestMapping("/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintsController {

    @Autowired
    private ComplaintsRepository complaintsRepository;

    //Create a New Complaint (Auto Date & Time)
    @PostMapping("/add")
    public ResponseEntity<String> addComplaint(@RequestBody Complaints complaint) {
        Complaints newComplaint = new Complaints(complaint.getTitle(), complaint.getDescription());
        complaintsRepository.save(newComplaint);
        return ResponseEntity.ok("Complaint added successfully with ID: " + newComplaint.getId());
    }

    // Get All Complaints
    @GetMapping
    public ResponseEntity<List<Complaints>> getAllComplaints() {
        List<Complaints> complaints = complaintsRepository.findAll();
        return ResponseEntity.ok(complaints);
    }

    // Delete Complaint by ID
    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteComplaint(@PathVariable String id) {
        Optional<Complaints> complaintOpt = complaintsRepository.findById(id);
        if (complaintOpt.isPresent()) {
            complaintsRepository.deleteById(id);
            return ResponseEntity.ok("Complaint deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Complaint not found.");
        }
    }
}
