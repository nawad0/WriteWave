namespace WriteWave.Application.Contracts.Users;

public class AuthenticateResponse
{
    public int Id { get; set; }
    public string? Username { get; set; }
    public string Token { get; set; }
}