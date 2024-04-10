using WriteWave.Domain.Models;

namespace WriteWave.Application.Auth;

public interface IJwtProvider
{
    
    string GenerateToken(User user);
}