#!/usr/bin/env bash
# Build script for Render

# Install dependencies
pip install -r requirements_render.txt

# Initialize database
python init_db.py
