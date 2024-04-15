using Microsoft.AspNetCore.Http;
using WriteWave.Persistence.DTOs;

namespace WriteWave.Application.Minio;

public interface IMinioService
{
    Task<string> PutObject(IFormFile file);
    Task<GetObjectDto> GetObject(string token);
}