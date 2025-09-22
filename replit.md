# GinyWow - Online Tools Platform

## Overview

GinyWow is a web application that offers PDF, video, image and other online tools to make your life easier. The platform provides various tools for content creation, file conversion, and productivity enhancement, similar to TinyWow's approach to simplifying everyday tasks.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **State Management**: TanStack Query for server state and local React state for UI
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth UI transitions and interactions
- **File Uploads**: React Dropzone for drag-and-drop image uploads

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Development**: TSX for development server with hot reload
- **Production Build**: ESBuild for server bundling, Vite for client bundling
- **API Design**: RESTful endpoints with structured error handling and logging
- **File Processing**: Multer for handling multipart form uploads with image validation

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema updates
- **Development Storage**: In-memory storage implementation for rapid development
- **Image Storage**: Base64 encoding for thumbnail data storage in database

### Authentication and Authorization
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Security**: Environment-based API key management for external services

### External Service Integrations
- **AI Processing**: OpenAI GPT-5 for thumbnail analysis and title optimization
- **Image Enhancement**: AI-powered image processing for contrast, saturation, and clarity improvements
- **Performance Analytics**: CTR prediction and SEO scoring algorithms

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm & drizzle-kit**: Type-safe database ORM and migration tools
- **@tanstack/react-query**: Powerful data fetching and state management
- **openai**: Official OpenAI API client for GPT-5 integration
- **multer**: File upload handling middleware for Express

### UI Component Libraries
- **@radix-ui/***: Headless UI components for accessibility and functionality
- **framer-motion**: Animation library for smooth user interactions
- **react-dropzone**: File upload with drag-and-drop interface
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for components

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution environment for Node.js
- **@replit/***: Replit-specific development plugins and error handling
- **esbuild**: Fast JavaScript bundler for production builds

### Validation and Type Safety
- **zod**: Schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation
- **typescript**: Static type checking throughout the application

The application follows a modern full-stack architecture with strong type safety, automated database migrations, and AI-powered features for productivity and content creation tools.