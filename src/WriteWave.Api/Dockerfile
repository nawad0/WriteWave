FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
EXPOSE 5177
# copy all .csproj files and restore as distinct layer. Use of the same COPY command 
# for every dockerfile in the project to take advantages of docker caching
COPY WriteWave.sln WriteWave.sln
COPY src/WriteWave.Api/WriteWave.Api.csproj src/WriteWave.Api/WriteWave.Api.csproj
COPY src/WriteWave.Application/WriteWave.Application.csproj src/WriteWave.Application/WriteWave.Application.csproj
COPY src/WriteWave.Domain/WriteWave.Domain.csproj src/WriteWave.Domain/WriteWave.Domain.csproj
COPY src/WriteWave.Persistence/WriteWave.Persistence.csproj src/WriteWave.Persistence/WriteWave.Persistence.csproj
COPY src/WriteWave.Infrastructure/WriteWave.Infrastructure.csproj src/WriteWave.Infrastructure/WriteWave.Infrastructure.csproj

# Restore Package deps
RUN dotnet restore --force
# copy the app folders
COPY src/WriteWave.Api src/WriteWave.Api
COPY src/WriteWave.Application src/WriteWave.Application
COPY src/WriteWave.Domain src/WriteWave.Domain
COPY src/WriteWave.Persistence src/WriteWave.Persistence
COPY src/WriteWave.Infrastructure src/WriteWave.Infrastructure
WORKDIR /app/src/WriteWave.Api
RUN dotnet publish -c Release -o /app/src/out
# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
COPY --from=build /app/src/out .
ENTRYPOINT ["dotnet", "WriteWave.Api.dll"]
