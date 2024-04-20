using Microsoft.AspNetCore.Http;

namespace WriteWave.Persistence.DTOs;

public class UserEditDTO
{
    public string Username { get; set; }
    public string Email { get; set; }
    public IFormFile UserImage { get; set; }
}