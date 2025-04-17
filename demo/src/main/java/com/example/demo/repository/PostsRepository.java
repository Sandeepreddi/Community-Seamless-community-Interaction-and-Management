package com.example.demo.repository;

import com.example.demo.model.Posts;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

public interface PostsRepository extends MongoRepository<Posts, String> {
    Optional<Posts> findById(String id);
    
}