#TrafficPulse
Adaptive traffic signal updates based on real-time user feedback and majority-based logic. Lightweight &amp; community-powered.

🚦 Adaptive Traffic Signal System with User Feedback
A web-based adaptive traffic management system that updates traffic signal statuses in real-time based on user-submitted reports like congestion, roadblocks, or smooth traffic. This project simulates an affordable and community-driven alternative to sensor-based traffic systems.

🌐 Live Demo
Check it out here: [TrafficPulse Website](https://trafficpulse-862aa.web.app/)

🧠 Project Overview
- 📍 Users can submit real-time traffic reports based on their current location.
- 🗳 System uses a voting-based algorithm to decide the signal status (Red, Yellow, Green) for each area.
- 🔁 Signal updates every few minutes based on user feedback.
- 🌍 Live map and traffic signals displayed visually on the website.
- 👥 Users must sign in to report incidents.

📂 Key Features
- Simple and user-friendly interface
- Real-time incident reporting
- Community-driven traffic updates
- Signal logic based on feedback frequency
- Interactive map view with markers
- Secure login/logout system

 ⚙ Tech Stack Used

- *Frontend*: HTML, CSS, JavaScript, React  
- *Map Integration*: Leaflet.js  
- *State Management*: React Context API  
- *Authentication & Hosting*: Firebase  
- *Backend Logic*: JS/TS based feedback handling  

📁 Folder Structure (Major Files)

| File/Folder              | Description                                 |
|--------------------------|---------------------------------------------|
| Map.tsx                  | Displays interactive map and user location  |
| ReportForm.tsx           | User form to submit incidents               |
| TrafficSignal.tsx        | Displays signal status for each zone        |
| AuthContext.tsx          | Manages user login/logout                   |
| IncidentContext.tsx      | Stores live incident data                   |
| ProtectedRoute.tsx       | Restricts access for non-logged-in users    |

📌 How It Works

1. User logs in and submits traffic report.
2. Reports are grouped by location and time.
3. Algorithm evaluates which condition has the majority.
4. Signal color is updated based on the result.
5. Live signal and incidents are shown on the map.

👥 Team Contributions

- *Frontend & UI*: Layout, Navigation, Report Form, Signal Display
- *Map & Logic*: Leaflet integration, Context state, Feedback logic
- *Backend*: Authentication, Routing, Database logic
- *Documentation*: Report writing, Diagrams, Final PPT

📝 License

This project is created for educational purposes as part of a minor engineering project. Not for commercial use.

📬 Feedback

If you have suggestions or find bugs, feel free to open an issue or reach out!
