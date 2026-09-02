<div align="center">
  
![Futuristic Header](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<a href="https://github.com/Pruthviraj141/WariMitra">
  <img src="https://readme-typing-svg.demolab.com?font=Righteous&weight=900&size=110&pause=1000&color=FF5722&center=true&vCenter=true&width=1000&height=180&lines=VISAVA;WARI+MITRA;VOICE+AI" alt="Typing SVG" />
</a>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=24&pause=1000&color=F77E21&center=true&vCenter=true&width=800&height=50&lines=Connecting+Varkaris+with+Help+in+Real+Time;Voice+AI.+Real-time+Maps.+Lifesaving;Empowering+the+Warkari+Community+Worldwide" alt="Typing SVG" />

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active%20Development-success.svg?style=for-the-badge&logo=github">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge&logo=github">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=for-the-badge&logo=docker">
  <img src="https://img.shields.io/badge/AWS-EC2%20Deployed-FF9900.svg?style=for-the-badge&logo=amazon-aws">
</p>

---

### 🌟 *The Future of Pilgrimage Safety & Assistance* 🌟
Visava (WariMitra) is a next-generation, highly scalable **Microservices Platform** designed to save lives and provide real-time assistance during massive pilgrimages. Powered by state-of-the-art **Conversational AI**, it allows users to find shelters, medical camps, and report missing persons entirely hands-free in multiple languages (Marathi, English).

---

</div>

<br>

<div align="center">
  <h2>🚀 Supercharged Tech Stack</h2>
  <p>Engineered for massive scale, real-time latency, and uncompromised reliability.</p>
  <img src="https://skillicons.dev/icons?i=react,ts,nodejs,express,go,mongodb,redis,docker,aws,nginx,vite,git&theme=dark&perline=6" />
</div>

<br>

---

## 🔥 Key Features

<table align="center">
  <tr>
    <td align="center" width="50%">
      <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3h0Y2xtaTh5am83Nmh0ZWc3ZzVzYnh4OXJ1cWVxYzdtaWx0NXg1eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1tvI9svkIWwpVYr/giphy.gif" width="100px" alt="Voice AI"><br>
      <b>🎙️ Conversational AI Agent</b><br>
      <i>Hands-free Vapi AI integration offering sub-second response times in native Marathi.</i>
    </td>
    <td align="center" width="50%">
      <img src="https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif" width="100px" alt="Real Time"><br>
      <b>🗺️ Live Geolocation Tracking</b><br>
      <i>React + Leaflet maps rendering real-time shelters, medical camps, and safe zones.</i>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="https://media.giphy.com/media/3o7aD2saalEvTe8sW4/giphy.gif" width="100px" alt="Microservices"><br>
      <b>⚡ Go-Powered Geo-Service</b><br>
      <i>Lightning-fast geospatial querying backed by Redis caching for immediate lookups.</i>
    </td>
    <td align="center" width="50%">
      <img src="https://media.giphy.com/media/Jso1SVsFbgHkH20NnZ/giphy.gif" width="100px" alt="Broadcast"><br>
      <b>🚨 Emergency Broadcast System</b><br>
      <i>Instant missing-person reporting that broadcasts to all volunteers in the network.</i>
    </td>
  </tr>
</table>

---

## 🏗️ System Architecture

Visava is built on a professional, loosely-coupled microservices architecture designed for high availability on AWS.

```mermaid
graph TD
    %% Styling
    classDef user fill:#FF9900,stroke:#333,stroke-width:4px,color:#fff;
    classDef gateway fill:#2496ED,stroke:#333,stroke-width:2px,color:#fff;
    classDef service fill:#68A063,stroke:#333,stroke-width:2px,color:#fff;
    classDef ai fill:#673AB7,stroke:#333,stroke-width:2px,color:#fff;
    classDef db fill:#47A248,stroke:#333,stroke-width:2px,color:#fff;
    classDef cache fill:#DC382D,stroke:#333,stroke-width:2px,color:#fff;

    %% Nodes
    User(("👤 Varkari / User")):::user
    Nginx["🌐 Nginx / React Frontend"]:::gateway
    Vapi["🎙️ Vapi AI Cloud"]:::ai
    VA["🤖 Voice Agent (Node.js)"]:::service
    CA["⚙️ Core API (Node.js)"]:::service
    GS["🗺️ Geo Service (Go)"]:::service
    MongoDB[("🍃 MongoDB Atlas")]:::db
    Redis[("🔴 Redis Cache")]:::cache

    %% Connections
    User -- "Browser / GPS" --> Nginx
    User -- "Phone / Voice" --> Vapi
    Nginx -- "REST API" --> CA
    Vapi -- "Webhook / Tools" --> VA
    VA -- "Fetch Services" --> CA
    CA -- "Geo Queries" --> GS
    CA -- "Read / Write" --> MongoDB
    GS -- "Sub-millisecond Cache" --> Redis
```

---

## 🚀 Quick Start (Dockerized)

Getting Visava running is literally a single command thanks to our fully containerized Docker architecture.

<details>
<summary><b>🛠️ Click to reveal Setup Instructions</b></summary>

### 1. Clone & Configure
```bash
git clone https://github.com/Pruthviraj141/WariMitra.git Visava
cd Visava

# Copy environment files
cp core-api/.env.example core-api/.env
cp voice-agent/.env.example voice-agent/.env
```

### 2. Launch the Ecosystem
```bash
docker compose up -d --build
```

**That's it! Your services are live:**
*   🌐 **Frontend**: `http://localhost:80`
*   ⚙️ **Core API**: `http://localhost:3000`
*   🗺️ **Geo Service**: `http://localhost:8081`
*   🤖 **Voice Agent**: `http://localhost:4000`

</details>

---

## 🔮 Future Scope & Roadmap

We are constantly pushing the boundaries of what is possible in disaster-management and pilgrimage tech.

| Phase | Milestone | Status | Description |
| :---: | :--- | :---: | :--- |
| **I** | **Microservices Foundation & Voice AI** | 🟢 Done | Vapi AI integration, Node/Go split, Dockerization, AWS CI/CD. |
| **II** | **Offline Mesh Networks** | 🟡 IP | Allow Varkaris to communicate without internet using Bluetooth mesh algorithms. |
| **III** | **Predictive Crowd Control** | 🔴 Planned | AI modeling using historical data to predict stampedes and dynamically reroute crowds. |
| **IV** | **Drone Medical Delivery** | 🔴 Planned | Automated dispatch of emergency medical supplies to exact GPS coordinates via drones. |

---

## 🤝 Contributing

We welcome PRs from developers of all skill levels! If you want to help save lives using code, check out our issues tab.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <b>Built with ❤️ for the Varkari Community</b>
  <br><br>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" width="100%">
</div>
