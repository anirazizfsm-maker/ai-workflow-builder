# Multi-stage Docker build for production deployment

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
COPY shared ./shared/

# Install dependencies
RUN npm ci --only=production --silent
RUN cd backend && npm ci --only=production --silent
RUN cd frontend && npm ci --silent

# Copy source code
COPY backend ./backend/
COPY frontend ./frontend/

# Build applications
RUN cd backend && npm run build
RUN cd frontend && npm run build

# Production stage for backend
FROM node:18-alpine AS backend-production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Copy built application
COPY --from=builder --chown=backend:nodejs /app/backend/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/backend/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/backend/package.json ./package.json
COPY --from=builder --chown=backend:nodejs /app/shared ./shared

USER backend

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\n  CMD node healthcheck.js

ENTRYPOINT [\"dumb-init\", \"--\"]
CMD [\"node\", \"dist/server.js\"]

# Production stage for frontend (served by nginx)
FROM nginx:alpine AS frontend-production

# Copy built frontend
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD [\"nginx\", \"-g\", \"daemon off;\"]", "original_text": "", "replace_all": false}