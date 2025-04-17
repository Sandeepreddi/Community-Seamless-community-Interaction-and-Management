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

import com.example.demo.model.NoticeData;
import com.example.demo.repository.NoticeRepository;

@RestController
@RequestMapping("/notice")
@CrossOrigin(origins = "http://localhost:5173")
public class NoticeController {

    @Autowired
    private NoticeRepository noticeRepository;

    // Create Notice (POST)
    @PostMapping("/upload")
    public ResponseEntity<String> addNotice(
            @RequestParam("name") String name,
            @RequestParam("date") String date,
            @RequestParam("time") String time,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile file) {

        try {
            Binary imageBinary = null;
            if (file != null && !file.isEmpty()) {
                // Validate Image Size (Example: Limit to 5MB)
                if (file.getSize() > 5 * 1024 * 1024) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Image size exceeds 5MB");
                }

                // Validate Image Type
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only image files are allowed");
                }

                imageBinary = new Binary(BsonBinarySubType.BINARY, file.getBytes());
            }

            // Save in MongoDB
            NoticeData notice = new NoticeData(name, date, time, description, imageBinary);
            notice = noticeRepository.insert(notice);
            return ResponseEntity.ok("Notice saved with ID: " + notice.getId());

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving notice: " + e.getMessage());
        }
    }

    // Retrieve All Notices (GET)
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllNotices() {
        List<NoticeData> notices = noticeRepository.findAll();
        List<Map<String, Object>> response = notices.stream().map(notice -> {
            Map<String, Object> noticeData = new HashMap<>();
            noticeData.put("id", notice.getId());
            noticeData.put("name", notice.getName());
            noticeData.put("date", notice.getDate());
            noticeData.put("time", notice.getTime());
            noticeData.put("description", notice.getDescription());
            noticeData.put("imageBase64", notice.getImageBase64() != null ? notice.getImageBase64() : "");
            return noticeData;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // Retrieve Notice by ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getNoticeById(@PathVariable String id) {
        Optional<NoticeData> noticeOptional = noticeRepository.findById(id);
        if (noticeOptional.isPresent()) {
            NoticeData notice = noticeOptional.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", notice.getId());
            response.put("name", notice.getName());
            response.put("date", notice.getDate());
            response.put("time", notice.getTime());
            response.put("description", notice.getDescription());
            response.put("imageBase64", notice.getImageBase64() != null ? notice.getImageBase64() : "");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Update Notice (PUT)
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateNotice(
            @PathVariable String id,
            @RequestParam("name") String name,
            @RequestParam("date") String date,
            @RequestParam("time") String time,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile file) {

        Optional<NoticeData> noticeOptional = noticeRepository.findById(id);
        if (!noticeOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notice not found");
        }

        try {
            NoticeData notice = noticeOptional.get();
            notice.setName(name);
            notice.setDate(date);
            notice.setTime(time);
            notice.setDescription(description);

            if (file != null && !file.isEmpty()) {
                // Validate Image Size (Example: Limit to 5MB)
                if (file.getSize() > 5 * 1024 * 1024) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Image size exceeds 5MB");
                }

                // Validate Image Type
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only image files are allowed");
                }

                notice.setImage(new Binary(BsonBinarySubType.BINARY, file.getBytes()));
            }

            noticeRepository.save(notice);
            return ResponseEntity.ok("Notice updated successfully");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating notice: " + e.getMessage());
        }
    }

    // Delete Notice (DELETE)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteNotice(@PathVariable String id) {
        if (!noticeRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notice not found");
        }

        noticeRepository.deleteById(id);
        return ResponseEntity.ok("Notice deleted successfully");
    }
}
