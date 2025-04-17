package com.example.demo.controller;

import com.example.demo.model.Servicedata;
import com.example.demo.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/service")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    //  Create a new service request
    @PostMapping("/create")
    public ResponseEntity<String> createService(@RequestBody Servicedata serviceData) {
        serviceRepository.save(serviceData);
        return ResponseEntity.status(HttpStatus.CREATED).body("Service request created successfully");
    }

    //  Fetch all service requests
    @GetMapping("/all")
    public ResponseEntity<List<Servicedata>> getAllServices() {
        List<Servicedata> services = serviceRepository.findAll();
        return ResponseEntity.ok(services);
    }

    //  Fetch a single service request by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable String id) {
        Optional<Servicedata> service = serviceRepository.findById(id);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Service request not found");
    }

    //  Update a service request
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateService(@PathVariable String id, @RequestBody Servicedata updatedService) {
        if (!serviceRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Service request not found");
        }
        updatedService.setId(id);
        serviceRepository.save(updatedService);
        return ResponseEntity.ok("Service request updated successfully");
    }

    //  Delete a service request
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteService(@PathVariable String id) {
        if (!serviceRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Service request not found");
        }
        serviceRepository.deleteById(id);
        return ResponseEntity.ok("Service request deleted successfully");
    }
}
