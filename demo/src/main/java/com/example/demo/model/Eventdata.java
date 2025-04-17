package com.example.demo.model;

import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Document(collection = "EventData") // MongoDB collection name
public class Eventdata {

    @Id
    private String id;
    private String name;
    private String date;
    private String description;
    private Binary image;
    private List<Feedback> feedbacks; // ✅ Updated to match controller

    // ✅ No-Args Constructor
    public Eventdata() {
        this.feedbacks = new ArrayList<>(); // Initialize list
    }

    // ✅ Parameterized Constructor
    public Eventdata(String name, String date, String description, Binary image) {
        this.name = name;
        this.date = date;
        this.description = description;
        this.image = image;
        this.feedbacks = new ArrayList<>(); // Initialize list
    }

    // ✅ Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Binary getImage() { return image; }
    public void setImage(Binary image) { this.image = image; }

    public String getImageBase64() {
        return (this.image != null && this.image.getData().length > 0) 
            ? Base64.getEncoder().encodeToString(this.image.getData()) 
            : "";
    }

    // ✅ Feedback Getters and Setters
    public List<Feedback> getFeedbacks() {
        return feedbacks;
    }

    public void setFeedbacks(List<Feedback> feedbacks) {
        this.feedbacks = feedbacks;
    }

    public void addFeedback(Feedback feedback) {
        this.feedbacks.add(feedback);
    }

    // Inner Class for Feedback
    public static class Feedback {
        private String user;
        private String comment;

        // Constructors
        public Feedback() {}

        public Feedback(String user, String comment) {
            this.user = user;
            this.comment = comment;
        }

        // Getters and Setters
        public String getUser() { return user; }
        public void setUser(String user) { this.user = user; }

        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
}
