namespace WriteWave.Application.Email;

public interface IEmailService
{
    public Task<bool> SendEmailAsync(string toEmail, string subject, string body);
}