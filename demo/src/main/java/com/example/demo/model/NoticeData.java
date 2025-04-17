package com.example.demo.model;
import java.util.Base64;

import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "NoticeData") // MongoDB collection name
public class NoticeData {
    @Id
    private String id;
    private String name;
    private String date;
    private String time;
    private String description;
    private Binary image;


    // Parameterized Constructor (With All Fields)
    public NoticeData(String name, String date, String time, String description, Binary image) {
        this.name = name;
        this.date = date;
        this.time = time;
        this.description = description;
        this.image = image;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Binary getImage() { return image; }
    public void setImage(Binary image) { this.image = image; }

    public String getImageBase64() {
        return (this.image != null && this.image.getData().length > 0) 
            ? Base64.getEncoder().encodeToString(this.image.getData()) 
            : "";
    }
}
