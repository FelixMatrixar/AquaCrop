# AquaCrop - Agentic Farm Management

AquaCrop is a next-generation, agentic web application designed to serve as a proactive digital agronomist for modern farmers. It offers autonomous monitoring, predictive analysis, and intelligent task execution to optimize farm management, powered by the Google Gemini API.


## 🎥 Pitch & Demo

Watch our pitch and see AquaCrop in action:

[![AquaCrop Demo Video](https://img.youtube.com/vi/pA1q_CeELDE/0.jpg)](https://youtu.be/pA1q_CeELDE)

## ✨ Features

-   **AI-Powered Irrigation Scheduling**: Generates optimal watering schedules based on real-time weather, satellite, and crop data.
-   **Sprout AI Assistant**: An intelligent chatbot that provides data-driven answers to farming questions.
-   **Field Management**: Add, edit, and visualize farm fields on an interactive map.
-   **Real-time Monitoring**: Dashboard widgets for current weather conditions, soil moisture, and vegetation health.
-   **Agent Log**: A transparent log of all autonomous actions and decisions made by Sprout AI.
-   **Pro Features**: Includes smart notifications for critical events like low soil moisture and upcoming irrigation tasks.
-   **Interactive Tour**: A guided tour for new users to quickly get acquainted with the app's features.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI**: Google Gemini API (`gemini-2.5-flash`, `imagen-4.0-generate-001`)
-   **Backend**: Firebase (Authentication, Firestore)
-   **Mapping**: Google Maps API

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   A package manager like `npm` or `yarn`

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/FelixMatrixar/aquacrop.git
    cd aquacrop
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Variables

To run this project, you will need to create a `.env` file in the root of your project directory. This file will store all the necessary API keys and configuration.

Create a file named `.env` and add the following content, replacing the placeholder values with your actual credentials:

```env
# Google Gemini API Key
API_KEY=your_gemini_api_key

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

**Where to get the keys:**

-   `API_KEY`: Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
-   `GOOGLE_MAPS_API_KEY`: Get your Google Maps key from the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis). Make sure to enable the "Maps JavaScript API".
-   `FIREBASE_*`: Get your Firebase configuration from your project's settings in the [Firebase Console](https://console.firebase.google.com/).

### Running the Application

Once you have set up your `.env` file, you can run the development server (assuming a Vite-based setup):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port specified in your terminal) to view the application in your browser.
