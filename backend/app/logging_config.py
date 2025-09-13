# backend/app/logging_config.py
import logging
from pythonjsonlogger import jsonlogger
import os

def setup_logging():
    # Define the log file path
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    log_file_path = os.path.join(log_dir, "api_requests.log")

    # Set up the logger
    logger = logging.getLogger('api_logger')
    logger.setLevel(logging.INFO)

    # Create a handler to write logs to a file
    file_handler = logging.FileHandler(log_file_path)

    # Use a custom formatter for JSON output
    formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(levelname)s %(name)s %(message)s'
    )
    file_handler.setFormatter(formatter)

    # Add the handler to the logger
    if not logger.handlers:
        logger.addHandler(file_handler)
    
    # Optional: Also log to console for development
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    if not any(isinstance(h, logging.StreamHandler) for h in logger.handlers):
        logger.addHandler(console_handler)

    return logger

# Create a logger instance that can be imported and used
api_logger = setup_logging()