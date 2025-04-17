package com.example.demo.controller;

import com.example.demo.model.StaticData;
import com.example.demo.repository.StaticRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/static")
@CrossOrigin(origins = "http://localhost:5173")
public class StaticController {

    @Autowired
    private StaticRepository staticRepository;

    // Create static data
    @PostMapping("/create")
    public ResponseEntity<String> createStaticData(@RequestBody StaticData staticData) {
        staticRepository.save(staticData);
        return ResponseEntity.ok("Static data created successfully");
    }

    // Fetch the first available static data (assuming there’s only one)
    @GetMapping("/get")
public ResponseEntity<StaticData> getStaticData() {
    Optional<StaticData> staticData = staticRepository.findAll().stream().findFirst();

    return staticData.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
}

    // Fetch by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getStaticDataById(@PathVariable String id) {
        Optional<StaticData> staticData = staticRepository.findById(id);

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Static request not found");
    }
}
