# Generative AI Job Application Assistant (JAA)

### Project Overview
The Generative AI Job Application Assistant (JAA) is a capstone project designed to address the time-consuming and inefficient process of tailoring job application materials. The manual effort required for each application often leads to generic submissions and low success rates, particularly for new graduates.

This Minimum Viable Product (MVP) automates the core task of personalizing resumes and cover letters. By synthesizing a user's professional background with a specific job description, the JAA generates documents that are highly relevant and tailored, allowing users to focus on higher-value activities like networking and interview preparation.

### Key Features of the MVP
* **User Profile Setup:** A user-friendly web form for capturing and securely storing a user's professional background, including education, work experience, and skills.
* **Job Data Processing:** The backend efficiently scrapes and extracts key information from a single job posting URL (e.g., from LinkedIn), including job title, company, description, and requirements.
* **AI Integration:** Utilizes the **Google Gemini 2.5 Flash API** with specialized prompt engineering to intelligently synthesize user and job data. This core logic is responsible for generating personalized application documents.
* **Output Display:** The final generated resume and cover letter are presented on a simple web interface in a copyable format, making them easy for the user to download and use.

### Technologies Used
The MVP is built on a modern, robust technology stack:
* **Frontend:** React.js
* **Backend:** FastAPI (Python)
* **Database:** PostgreSQL
* **AI/LLM:** Google Gemini 2.5 Flash API
* **Containerization:** Docker & Docker Compose

---

### Setup Instructions
This project is configured to run using Docker for a seamless setup process.

#### Prerequisites
* **Docker:** Ensure you have Docker and Docker Compose installed on your system.
* **Git:** You will need Git to clone the repository.
* **Google Gemini API Key:** Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

#### Step-by-Step Guide

1.  **Clone the Repository**
    Start by cloning the project repository to your local machine.

    ```sh
    git clone [https://github.com/Hydarhafiz/Gen-AI-Job-Application-Automation](https://github.com/Hydarhafiz/Gen-AI-Job-Application-Automation)
    cd your-repo-name
    ```

2.  **Create Environment Variables File**
    Create a `.env` file in the backend folder of the project with the following content. This file will be used by Docker Compose to configure your application and database.

    ```
    # In jaa-project/backend/.env
    SECRET_KEY="your-secret-key"
    # Database credentials
    POSTGRES_USER=myuser
    POSTGRES_PASSWORD=mypassword
    POSTGRES_DB=jaa_db
    
    # The database URL for FastAPI to use (the `db` service name is used here)
    DATABASE_URL=postgresql://myuser:mypassword@db:5432/jaa_db
    GEMINI_API_KEY="your_gemini_api_key"
    ```

3.  **Build and Run with Docker Compose**
    From the root directory of the project, run the following command. This will build the Docker images for your backend and frontend and start all services (backend, frontend, and database).

    ```sh
    docker compose up --build
    ```
    
    Once the build process is complete, the application will be accessible.
    * The frontend will be running at `http://localhost:3000`.
    * The backend API will be running at `http://localhost:8000`.

---

### Future Improvements
This MVP serves as a strong foundation for future development, with a clear roadmap for expansion:
* **Phase 2: Multi-Agent Automation System:** Transform the project into an automated pipeline using a framework like LangGraph. This system will include specialized AI agents for job discovery, strategic analysis, and automated application submission.
* **Phase 3: The AI Co-Pilot:** Introduce a conversational interface with a chatbot agent built on LangChain's ReAct paradigm. This will create an interactive, learning AI assistant that can provide personalized feedback and insights based on past application outcomes.
* **Support for Multiple Job Boards:** Expand the web scraping capabilities to support a wider range of job boards, such as Indeed and Glassdoor.
* **Enhanced Document Formats:** Implement more sophisticated document generation, including different resume templates and formatting options (e.g., PDF output).
