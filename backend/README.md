# Git README Backend

A backend service for managing user profiles and generating GitHub statistics and insights. This application integrates with GitHub to fetch user data, generate language cards, contribution statistics, and other profile-related information.

## Overview

This is a TypeScript-based backend server that provides APIs for user authentication, profile management, and GitHub data integration. The application uses Redis for caching and job queues to handle asynchronous tasks efficiently.

## Key Features

- **User Management**: Handle user authentication and profile management
- **GitHub Integration**: Fetch user statistics, language usage, and contribution data from GitHub
- **Caching Layer**: Redis-based caching for improved performance
- **Async Job Queue**: Background job processing for stats generation and profile updates
- **Error Handling**: Comprehensive error handling and validation middleware
- **Session Management**: Temporary OAuth state sessions plus JWT bearer authentication

## Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Database/Cache**: Redis
- **Build**: TSConfig configuration for TypeScript compilation

## Project Structure

- `controllers/` - Request handlers for app, user, and profile endpoints
- `models/` - Data models for app and user entities
- `routes/` - API route definitions
- `github/` - GitHub API integration utilities
- `cache/` - Redis connection and caching logic
- `queue/` - Job queue implementation for background tasks
- `error/` - Error handling and validation middleware
- `ai/` - AI/LLM integration for response generation
- `utils/` - Utility functions for session, authentication, and token management
- `validations/` - Input validation schemas

## For Frontend Developers

This backend service powers the Git README application, which generates beautiful profile cards and statistics for GitHub users. 

**What does it do?**
- Authenticates users and manages their sessions
- Fetches real-time data from GitHub (user stats, languages, contributions)
- Generates dynamic cards and visualizations (language cards, stats cards)
- Processes asynchronous jobs to keep data up-to-date
- Provides endpoints to manage user profiles and preferences

**How to integrate:**
- Call the authentication endpoints to log users in and establish sessions
- Use the profile endpoints to fetch and update user information
- Integrate the GitHub stats endpoints to display real-time GitHub data on your frontend
- The backend handles caching, so data is retrieved efficiently without overwhelming the GitHub API

Think of this backend as the brain that talks to GitHub and prepares all the data your frontend needs to display beautiful user profiles and statistics.

## Getting Started

## Environment Variables

The backend requires these environment variables for the OAuth and JWT auth flow:

- `JWT_SECRET` - Secret used to sign and verify access tokens
- `GITHUB_CLIENT_ID` - GitHub OAuth app client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth app client secret
- `GITHUB_REDIRECT_URI` - Backend GitHub callback URL
- `FRONTEND_URL` - Frontend base URL used for redirects after OAuth completion
- `SESSION_SECRET` - Secret used only for temporary OAuth state sessions

Refer to the main project documentation for setup and installation instructions.
