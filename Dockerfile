# 1- Base
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./

# 2- Development
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# 3- Build
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# 4- Production
FROM base AS production
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/package*.json ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]