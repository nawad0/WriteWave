using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WriteWave.Application.Auth;
using WriteWave.Domain.Models;

namespace WriteWave.Infrastructure.Auth;

public class JwtProvider : IJwtProvider
{

    private readonly JwtOptions _options;
    public JwtProvider(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }
    public string GenerateToken(User user) 
    {
        List<Claim> claims = new List<Claim>(); 
        claims.Add(new Claim("userId", user.UserId.ToString()));
        claims.Add(new Claim("username", user.Username));
        claims.Add(new Claim(ClaimTypes.Role, user.Role.ToString()));
 
        var signingCredentials = new SigningCredentials
        (
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey)),
            SecurityAlgorithms.HmacSha256
        );
        var token = new JwtSecurityToken(
            signingCredentials: signingCredentials,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_options.ExpireHours)
        );
        var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);
        return tokenValue;
    }
    public bool CanAddAdmin(User currentUser, User targetUser)
    {
        
        return currentUser.Role == Roles.Admin && !(targetUser.Role == Roles.Admin);
    }
    
}
