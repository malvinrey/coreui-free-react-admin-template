FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the Vite development port
EXPOSE 3000

# Start the development server with correct script
CMD ["npm", "start", "--", "--host"]
