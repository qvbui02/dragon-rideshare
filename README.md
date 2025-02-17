# Dragon Rideshare

## Setup Instructions

### 1. Clone the Repository

Begin by cloning the repository and navigating into the project directory:

```bash
git clone <your_repo_url> dragon-rideshare
cd dragon-rideshare
```

### 2. Configure Environment Variables

1. Move into the `back` folder:
   ```bash
   cd back
   ```
2. Copy the example environment file to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and set your `JWT_SECRET`:
   - Generate a secure secret key from [jwtsecret.com/generate](https://jwtsecret.com/generate).
   - Replace `your_secret_key` in the `.env` file with the generated key.

### 3. Install Dependencies & Run the Application

While inside the `back` folder, execute the following commands:

```bash
npm run setup  # Initializes the database
npm run full-deploy  # Installs dependencies and starts the application
```

### 4. Access the Application

Once the server is running, you can access the full website at:

- **Website URL**: [http://localhost:3000](http://localhost:3000)

> The frontend is served directly through Express.