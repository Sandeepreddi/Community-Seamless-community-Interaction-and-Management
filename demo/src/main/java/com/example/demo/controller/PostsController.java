package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.bson.BsonBinarySubType;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.*;

import com.example.demo.model.Posts;
import com.example.demo.repository.PostsRepository;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostsController {

    @Autowired
    private PostsRepository postRepository;

    // **Create Post (with Image)**
    @PostMapping("/create")
    public ResponseEntity<Posts> createPost(
        @RequestParam("name") String name,
        @RequestParam("date") String date,
        @RequestParam("description") String description,
        @RequestParam("image") MultipartFile image) {
        
        try {
            Posts newPost = new Posts();
            newPost.setName(name);
            newPost.setDate(date);
            newPost.setDescription(description);
            newPost.setImage(new Binary(BsonBinarySubType.BINARY, image.getBytes()));

            Posts savedPost = postRepository.save(newPost);
            return ResponseEntity.ok(savedPost);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // **Get All Posts**
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllPosts() {
        List<Posts> posts = postRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Posts post : posts) {
            Map<String, Object> postData = new HashMap<>();
            postData.put("id", post.getId());
            postData.put("name", post.getName());
            postData.put("date", post.getDate());
            postData.put("description", post.getDescription());
            postData.put("image", post.getImageAsBase64()); // Convert to Base64 for frontend display
            response.add(postData);
        }

        return ResponseEntity.ok(response);
    }

    // **Delete Post by ID**
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePost(@PathVariable String id) {
        Optional<Posts> post = postRepository.findById(id);
        if (post.isPresent()) {
            postRepository.deleteById(id);
            return ResponseEntity.ok("Post deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found.");
        }
    }
}
