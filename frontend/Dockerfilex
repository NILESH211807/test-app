# Build stage
FROM node:20-alpine AS build

WORKDIR /web

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# Production stage
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=build /web/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]