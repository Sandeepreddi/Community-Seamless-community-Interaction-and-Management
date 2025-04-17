package com.example.demo.model;

import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Base64;

@Document(collection = "Posts") // MongoDB collection name
public class Posts {

    @Id
    private String id;
    private String name;
    private String date;
    private String description;
    private Binary image;

    // Default constructor
    public Posts() {
    }

    // Parameterized constructor
    public Posts(String id, String name, String date, String description, Binary image) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.description = description;
        this.image = image;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Binary getImage() {
        return image;
    }

    public void setImage(Binary image) {
        this.image = image;
    }

    // Convert image to Base64 string for easy frontend use
    public String getImageAsBase64() {
        return image != null ? Base64.getEncoder().encodeToString(image.getData()) : null;
    }
}
