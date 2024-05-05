using Microsoft.Extensions.Configuration;
using MimeKit;
using WriteWave.Application.Email;

namespace WriteWave.Infrastructure.Email;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_config["EmailSettings:FromEmail"]));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = subject;
        email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = body };
        using var smtp = new MailKit.Net.Smtp.SmtpClient();
    
        smtp.Connect(_config["EmailSettings:MailServer"], int.Parse(_config["EmailSettings:MailPort"]), MailKit.Security.SecureSocketOptions.StartTls);
        smtp.Authenticate(_config["EmailSettings:FromEmail"], _config["EmailSettings:Password"]);
        smtp.Send(email);
        smtp.Disconnect(true);
        return true;

    }
}