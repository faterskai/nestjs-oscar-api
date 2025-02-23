# Base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --only-production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
