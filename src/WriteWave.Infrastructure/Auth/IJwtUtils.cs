using WriteWave.Domain.Models;

namespace WriteWave.Infrastructure.Auth;

public interface IJwtUtils
{
    public string GenerateJwtToken(User user);
    public int? ValidateJwtToken(string? token);
}
