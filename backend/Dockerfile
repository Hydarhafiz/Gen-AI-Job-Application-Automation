# In backend/Dockerfile

# Use the latest Playwright Python image
FROM mcr.microsoft.com/playwright/python:v1.55.0-jammy

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Copy the rest of the application code
COPY ./ /app/