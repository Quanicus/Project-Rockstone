FROM ghcr.io/puppeteer/puppeteer:21.3.6

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
# Create a non-root user
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs

# Change ownership of the working directory to the non-root user
RUN chown -R nodejs:nodejs /usr/src/app

# Switch to the non-root user
USER nodejs
CMD ["node", "server.js"]