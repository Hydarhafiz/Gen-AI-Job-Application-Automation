# In frontend/Dockerfile
# Use Node.js 20, which meets Vite's version requirements.
FROM node:20

# Set the working directory inside the container.
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory.
COPY package*.json ./

# Install the project dependencies.
RUN npm install

# Copy the rest of the application source code into the container.
COPY . .

# Expose the port that the Vite development server runs on.
EXPOSE 5173

# The command to run the development server.
CMD ["npm", "run", "dev"]