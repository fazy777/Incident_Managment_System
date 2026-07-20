# 🚨 Enterprise Incident Management & Monitoring System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![JavaFX](https://img.shields.io/badge/Desktop-JavaFX-ED8B00?logo=openjdk&logoColor=white)](https://openjfx.io/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![SQL](https://img.shields.io/badge/Database-MySQL%2FPostgreSQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Build Status](https://img.shields.io/badge/Build-In%20Progress-orange)](#-project-roadmap--deliverables)

---

## 📌 Executive Summary

The **Enterprise Incident Management and Monitoring System** is an end-to-end, high-performance solution engineered to track, categorize, escalate, and resolve technical incidents across enterprise organizations in real-time. 

Developed under the **Zynvex Solutions Internship Program**, this system bridges real-time web visualization for operations teams with advanced desktop administration capabilities for IT administrators, all powered by a robust, ACID-compliant database backend.

---

## 👨‍💻 Intern & Project Profile

| Parameter | Details |
| :--- | :--- |
| **Intern Name** | **Muhammad Faizan Ali** |
| **Internship ID** | `ZYNVEX-CERT-0673` |
| **Program** | Zynvex Solutions Software Engineering Internship |
| **Project Title** | Enterprise Incident Management and Monitoring System |
| **Repository URL** | [github.com/fazy777/Incident_Managment_System](https://github.com/fazy777/Incident_Managment_System.git) |
| **Target Completion** | August 15, 2026 |

---

## 📐 System Architecture

```
                                  ┌──────────────────────────────┐
                                  │      React Web Dashboard     │
                                  │  (Real-Time Incident Views)  │
                                  └──────────────┬───────────────┘
                                                 │
                                                 │ REST APIs / WebSocket
                                                 ▼
 ┌──────────────────────────────┐ ┌──────────────────────────────┐
 │ JavaFX Desktop Admin Client  ├─►  Spring Boot Backend Engine │
 │(Escalations & Deep Analytics)│ │ (Business Logic & Access)    │
 └──────────────────────────────┘ └──────────────┬───────────────┘
                                                 │
                                                 │ JDBC / Hibernate
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │   Relational SQL Database    │
                                  │    (MySQL / PostgreSQL)      │
                                  └──────────────────────────────┘
```

---

## ✨ Key Features

### 🌐 1. Real-Time Web Dashboard (React)
- **Live Monitoring**: Interactive dashboard presenting real-time status of critical, major, and minor technical incidents.
- **Incident Reporting**: Clean, user-friendly forms to capture system outages, bugs, and infrastructure requests.
- **Role-Based Access Control (RBAC)**: Secure authentication and custom access permissions for engineers and managers.

### 💻 2. Desktop Administration Client (JavaFX)
- **Advanced Escalations**: High-priority incident queue management and swift status escalation.
- **Historical Analytics**: Interactive charts and data metrics to analyze Resolution Time (MTTR), recurring faults, and SLA compliance.
- **Deep-Dive Configuration**: Administrative toolset for system configuration, user role provisioning, and audit logs.

### ⚡ 3. Enterprise Backend & Storage (Java Spring Boot & SQL)
- **ACID Compliance**: Ensures data consistency and transaction reliability for critical issue logs and audit trails.
- **RESTful API**: Standardized endpoints for seamless synchronization between Web, Desktop client, and Database.
- **High Volume Logging**: Optimized schema and indexing to support large-scale enterprise log volumes.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Web Frontend** | React, JSX, Modern CSS3 / Glassmorphism UI |
| **Desktop Client** | JavaFX, SceneBuilder, OpenJFX |
| **Backend Framework** | Java / Spring Boot, REST APIs |
| **Database** | SQL (MySQL / PostgreSQL), Hibernate ORM |
| **Build & Tooling** | Maven, Git, GitHub Actions |

---

## 🗓️ Project Roadmap & Deliverables

> **Submission Timeline**: July 20, 2026 – August 15, 2026

- [ ] **Module 1: Foundation & Authentication** *(July 20 – July 26, 2026)*
  - [ ] Relational SQL Database Schema Design
  - [ ] React Web Frontend Application Structure Initialization
  - [ ] User Authentication & Access Control Module

- [ ] **Module 2: Web Dashboard & CRUD Services** *(July 27 – August 02, 2026)*
  - [ ] Incident Logging and Reporting Forms in React
  - [ ] Spring Boot Backend API Integration for CRUD Operations
  - [ ] Status Filters and Real-time Incident List Views

- [ ] **Module 3: JavaFX Desktop Client & Analytics** *(August 03 – August 09, 2026)*
  - [ ] Development of JavaFX Admin Desktop Interface
  - [ ] Incident Escalation Workflows
  - [ ] Historical Analytics and MTTR Reporting Graphics

- [ ] **Module 4: Testing, Refinement & Final Release** *(August 10 – August 15, 2026)*
  - [ ] Comprehensive End-to-End System & API Testing
  - [ ] Bug Fixes, Security Polish, & Performance Tuning
  - [ ] Final Documentation & Repository Cleanup for Submission

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js** (v18.x or later) & **npm**
- **Java Development Kit (JDK)** 17 or later
- **Maven** 3.8+
- **MySQL** or **PostgreSQL** Server

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/fazy777/Incident_Managment_System.git

# Navigate to project directory
cd Incident_Managment_System
```

### 2. Database Configuration
1. Create a new database named `incident_db` in MySQL / PostgreSQL.
2. Update database credentials in `src/main/resources/application.properties` (Backend).

### 3. Running Backend (Spring Boot)
```bash
mvn clean install
mvn spring-boot:run
```

### 4. Running Web Dashboard (React)
```bash
cd frontend
npm install
npm start
```

### 5. Running Desktop Admin Client (JavaFX)
```bash
cd desktop-admin
mvn javafx:run
```

---

## 📝 Reporting Rules & Submissions

- **Weekly Progress Reports**: Updated repository link and `README.md` reflecting completed weekly modules submitted every weekend.
- **Final Submission Deadline**: **August 15, 2026** (Includes clean repository, final production code, and completed documentation).

---

## 📄 License & Contact

This project is submitted as part of the **Zynvex Solutions** Internship Program.

**Author**: [Muhammad Faizan Ali](https://github.com/fazy777)  
**Email**: [Contact via GitHub](https://github.com/fazy777)  
**Program**: ZYNVEX-CERT-0673  

*Built with ❤️ for Zynvex Solutions*
