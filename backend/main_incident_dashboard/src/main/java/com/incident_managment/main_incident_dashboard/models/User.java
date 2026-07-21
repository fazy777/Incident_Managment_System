package com.incident_managment.main_incident_dashboard.models;

import jakarta.persistence.*;


@Entity
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ID;
    @Column(name = "Username",nullable = false,unique = true,length = 50)
    private String Username;
    @Column(name = "email",nullable = false,unique = true)
    private String email;
    @Column(name = "Password",nullable = false)
    private String Password;
    @Column(name = "role",nullable = false)
    private String role;

    public User(Long ID, String username, String email, String password, String role) {
        this.ID = ID;
        Username = username;
        this.email = email;
        Password = password;
        this.role = role;
    }

    public User() {
        
    }

    public Long getID() {
        return ID;
    }

    public void setID(Long ID) {
        this.ID = ID;
    }

    public String getUsername() {
        return Username;
    }

    public void setUsername(String username) {
        Username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
