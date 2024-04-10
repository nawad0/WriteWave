using System.ComponentModel.DataAnnotations;

namespace WriteWave.Persistence.DTOs;

public class AuthenticateRequest
{
    [Required]
    public string? Username { get; set; }

    [Required]
    public string? Password { get; set; }
}
