package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "StaticData") // MongoDB collection name
public class StaticData {
    @Id
    private String id; 
    private int blocks;
    private int parkinglots;

    public StaticData() {}

    public StaticData(int blocks ,int parkinglots)
    {
        this.blocks = blocks;
        this.parkinglots=parkinglots;
    }

    public int getBlocks() {
        return blocks;
    }

    public void setBlocks(int blocks) {
        this.blocks = blocks;
    }

    public int getParkinglots(){
        return parkinglots;
    }

    public void setParkinglots(int parkinglots)
    {
        this.parkinglots=parkinglots;
    }

    
}
