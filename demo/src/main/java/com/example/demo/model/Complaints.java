package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "Complaints")
public class Complaints {
    @Id
    private String id;
    private String title;
    private String description;
    private LocalDate date; // Stores the current date
    private LocalTime time; // Stores the current time

    // No-Args Constructor (Auto-sets Date & Time)
    public Complaints() {
        this.date = LocalDate.now(); // Automatically captures the current date
        this.time = LocalTime.now(); // Automatically captures the current time
    }

    // Parameterized Constructor (Title & Description only)
    public Complaints(String title, String description) {
        this.title = title;
        this.description = description;
        this.date = LocalDate.now(); // Automatically sets the current date
        this.time = LocalTime.now(); // Automatically sets the current time
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return date;
    }

    public LocalTime getTime() {
        return time;
    }
}
