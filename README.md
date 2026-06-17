# TerraTech - Smart Crop Monitoring

TerraTech is an intelligent monitoring platform designed for farmers, allowing them to supervise crop lots, monitor humidity levels, and receive recommendations based on real-time field conditions.

## 🚀 How to Use the Project

Follow these steps to run the application in your local environment:

### 1. Install Dependencies
Make sure you are in the root folder of `FrontEnd` and run:

```powershell
npm install
```

### 2. Start the Frontend Application
In another terminal (without closing the previous server), run:

```powershell
npm run dev
```

*The application will be available at: `http://localhost:5173` (or the port indicated by Vite)*

---

## 🛠️ Project Details

### Main Technologies
- **Vue 3**: Progressive JavaScript framework.
- **Vite**: Fast frontend build tool.
- **Vue I18n**: Multi-language support (English / Spanish).
- **Axios**: HTTP client for consuming the API.
- **JSON-Server**: Mock API for local data persistence using `db.json`.

### Bounded Context Structure (DDD)
The project is organized following **Domain-Driven Design (DDD)** principles:

1. **Shared**: Contains the base infrastructure and common components such as Layout, Footer, and Internationalization.
2. **Monitoring**: The core functional module of the application.
   - **Domain**: Business entities (`Lot`).
   - **Infrastructure**: API clients and `Assemblers` for data mapping.
   - **Application**: State management (`Store`).
   - **Presentation**: Views and components (Lot listing, guided forms).

### Key Features
- **Monitoring Dashboard**: Visualization of crop lots with critical humidity states highlighted.
- **Guided Form**: Automatic humidity recommendations based on crop type.
- **Multi-language Support**: Full translation (EN/ES) for navigation, dashboard, and recommendations.
- **Automatic Images**: Random satellite image generation for new lots.

---

*Developed for the 5th Semester - Web Development.*