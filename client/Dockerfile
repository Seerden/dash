# Use a Node.js image
FROM node:18.18.0-alpine

# Set the working directory
WORKDIR /dash/client

# Copy package.json and yarn.lock to the container
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Copy shared types
COPY ../shared /dash/shared

# Expose the Vite development server port
EXPOSE 5173

# Run the Vite dev server
CMD ["yarn", "dev"]
