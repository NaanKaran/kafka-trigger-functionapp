# Need to pull in the Kafka extension as it's still in preview
FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build-env

COPY . /app

RUN cd /app && \
    rm -rf bin || true && \
    dotnet build -o bin

# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:3.0-appservice
FROM mcr.microsoft.com/azure-functions/node:3.0

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

ENV NODE_ENV=production

COPY . /home/site/wwwroot
RUN cd /home/site/wwwroot

COPY ["package.json", "./"]
RUN npm cache clean -f
RUN rm -rf node_modules
RUN npm install