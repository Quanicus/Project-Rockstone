FROM ghcr.io/puppeteer/puppeteer:21.3.6

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
# Add a non-root user and group
RUN groupadd -r dev && useradd -m -r -g dev -G dev sysadmin
# Change ownership of the application directory
RUN chown -R sysadmin:dev /usr/src/app
USER sysadmin

CMD ["node", "server.js"]