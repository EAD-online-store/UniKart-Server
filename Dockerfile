# Use the official Node.js 20 image
FROM node:20

# Create and set the working directory
WORKDIR /app

# Build arguments to accept environment variables during build
ARG NODE_ENV
ARG PORT
ARG FRONTEND_URL
ARG SECRET_KEY_ACCESS_TOKEN
ARG SECRET_KEY_REFRESH_TOKEN
ARG EMAIL
ARG EMAIL_PASS
ARG CLODINARY_API_SECRET_KEY
ARG CLODINARY_API_KEY
ARG CLODINARY_CLOUD_NAME
ARG MONGODB_URI

# Set environment variables within the container
ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV FRONTEND_URL=${FRONTEND_URL}
ENV SECRET_KEY_ACCESS_TOKEN=${SECRET_KEY_ACCESS_TOKEN}
ENV SECRET_KEY_REFRESH_TOKEN=${SECRET_KEY_REFRESH_TOKEN}
ENV EMAIL=${EMAIL}
ENV EMAIL_PASS=${EMAIL_PASS}
ENV CLODINARY_API_SECRET_KEY=${CLODINARY_API_SECRET_KEY}
ENV CLODINARY_API_KEY=${CLODINARY_API_KEY}
ENV CLODINARY_CLOUD_NAME=${CLODINARY_CLOUD_NAME}
ENV MONGODB_URI=${MONGODB_URI}    


# Copy package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Print the environment variables to verify they are set correctly
RUN echo "NODE_ENV=$NODE_ENV" \
&& echo "PORT=$PORT" \
&& echo "FRONTEND_URL=$FRONTEND_URL" \
&& echo "SECRET_KEY_ACCESS_TOKEN=$SECRET_KEY_ACCESS_TOKEN" \
&& echo "SECRET_KEY_REFRESH_TOKEN=$SECRET_KEY_REFRESH_TOKEN" \
&& echo "EMAIL=$EMAIL" \
&& echo "EMAIL_PASS=$EMAIL_PASS" \
&& echo "CLODINARY_API_SECRET_KEY=$CLODINARY_API_SECRET_KEY" \
&& echo "CLODINARY_API_KEY=$CLODINARY_API_KEY" \
&& echo "CLODINARY_CLOUD_NAME=$CLODINARY_CLOUD_NAME" \
&& echo "MONGODB_URI=$MONGODB_URI"

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]