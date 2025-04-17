package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.bson.BsonBinarySubType;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.stream.Collectors;
import java.util.*;

import com.example.demo.model.Eventdata;
import com.example.demo.repository.EventRepository;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // ✅ POST Endpoint to Upload Image
    @PostMapping("/upload")
public ResponseEntity<String> addEvent(
        @RequestParam("name") String name,
        @RequestParam("date") String date,
        @RequestParam("description") String description,
        @RequestParam("image") MultipartFile file) {

    try {
        // ✅ Validate Image Size (Example: Limit to 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Image size exceeds 5MB");
        }

        // ✅ Validate Image Type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only image files are allowed");
        }

        // ✅ Save Image in MongoDB (Binary Format)
        Eventdata event = new Eventdata(name, date, description,
                new Binary(BsonBinarySubType.BINARY, file.getBytes()));

        event = eventRepository.insert(event);
        return ResponseEntity.ok("Event saved with ID: " + event.getId());

    } catch (IOException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving event: " + e.getMessage());
    }
}



@GetMapping
public ResponseEntity<List<Map<String, Object>>> getAllEvents() {
    List<Eventdata> events = eventRepository.findAll();

    List<Map<String, Object>> response = events.stream().map(event -> {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("id", event.getId());
        eventData.put("name", event.getName());
        eventData.put("date", event.getDate());
        eventData.put("description", event.getDescription());
        
        // ✅ Ensure image is always a valid string (empty if null)
        String imageBase64 = event.getImageBase64();
        eventData.put("imageBase64", imageBase64 != null ? imageBase64 : "");  

        return eventData;
    }).collect(Collectors.toList());

    return ResponseEntity.ok(response);
}




    // ✅ GET Endpoint to Retrieve Image by ID
    @GetMapping("/{id}")
public ResponseEntity<Map<String, Object>> getEventById(@PathVariable String id) {
    Optional<Eventdata> eventOptional = eventRepository.findById(id);

    if (eventOptional.isPresent()) {
        Eventdata event = eventOptional.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", event.getId());
        response.put("name", event.getName());
        response.put("date", event.getDate());
        response.put("description", event.getDescription());
        response.put("imageBase64", event.getImageBase64() != null ? event.getImageBase64() : "");

        return ResponseEntity.ok(response);
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}

@PostMapping("/{eventId}/feedback")
public ResponseEntity<?> addFeedback(@PathVariable String eventId, @RequestBody Eventdata.Feedback feedback) {
    Optional<Eventdata> eventOpt = eventRepository.findById(eventId);
    if (eventOpt.isPresent()) {
        Eventdata event = eventOpt.get();
        event.getFeedbacks().add(feedback);
        eventRepository.save(event);
        return ResponseEntity.ok("Feedback added successfully.");
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.");
    }
}
@GetMapping("/{eventId}/feedbacks")
public ResponseEntity<List<Eventdata.Feedback>> getFeedbacks(@PathVariable String eventId) {
    Optional<Eventdata> eventOpt = eventRepository.findById(eventId);
    return eventOpt.map(event -> ResponseEntity.ok(event.getFeedbacks()))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
}

// ✅ Delete Notice (DELETE)
@DeleteMapping("/delete/{id}")
public ResponseEntity<String> deleteNotice(@PathVariable String id) {
    if (!eventRepository.existsById(id)) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notice not found");
    }

    eventRepository.deleteById(id);
    return ResponseEntity.ok("Notice deleted successfully");
}



}
