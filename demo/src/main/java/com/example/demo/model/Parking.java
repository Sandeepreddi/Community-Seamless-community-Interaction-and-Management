package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Parking") // MongoDB collection name
public class Parking {

    @Id
    private String id;
    private int parkingid;
    private String flatNo;
    private String block;
    private String status;

    // Default constructor
    public Parking() {
    }

    // Parameterized constructor
    public Parking(String id, int parkingid, String flatNo, String block, String status) {
        this.id = id;
        this.parkingid = parkingid;
        this.flatNo = flatNo;
        this.block = block;
        this.status = status;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getParkingid() {
        return parkingid;
    }

    public void setParkingid(int parkingid) {
        this.parkingid = parkingid;
    }

    public String getFlatNo() {
        return flatNo;
    }

    public void setFlatNo(String flatNo) {
        this.flatNo = flatNo;
    }

    public String getBlock() {
        return block;
    }

    public void setBlock(String block) {
        this.block = block;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
