using System.Security.Cryptography;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol.Plugins;
using WriteWave.Application.Contracts.Users;
using WriteWave.Application.Email;
using WriteWave.Application.Services;
using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Domain.Models;

namespace WriteWave.Api.Controllers;

    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
{
    private readonly UsersService _usersService;
    private readonly IUserRepository _userRepository;
    private IValidator<RegisterRequest> _registerRequestValidator;
    private IValidator<ResetPasswordRequest> _resetPasswordRequestValidator;
    private IValidator<LoginRequest> _loginRequestValidator;
    private readonly IEmailService _emailService;

    public AuthController(UsersService usersService, IUserRepository userRepository, IValidator<RegisterRequest> registerRequestValidator, IValidator<LoginRequest> loginRequestValidator, IEmailService emailService, IValidator<ResetPasswordRequest> resetPasswordRequestValidator)
    {
        _usersService = usersService;
        _userRepository = userRepository;
        _registerRequestValidator = registerRequestValidator;
        _loginRequestValidator = loginRequestValidator;
        _emailService = emailService;
        _resetPasswordRequestValidator = resetPasswordRequestValidator;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        ValidationResult validationResult = await _registerRequestValidator.ValidateAsync(request);

        if (!validationResult.IsValid) 
        {
            return BadRequest(validationResult.ToDictionary());
        }
        
        await _usersService.Register(request.Username, request.Password, request.Email);
        var user = await _userRepository.GetAsync(u => u.Username == request.Username);
        var result = await SendConfirmationEmail(request.Email, user.VerificationToken);
        if (!result)
        {
            return BadRequest("Failed to send email");
        }

        return Ok(new { Message = "Email sent" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        ValidationResult validationResult = await _loginRequestValidator.ValidateAsync(request);
        
        if (!validationResult.IsValid) 
        {
            return BadRequest(validationResult.ToDictionary());
        }
        try
        {
            var token = await _usersService.Login(request.Username, request.Password);
            if (token == null)
            {
                return Forbid();
            }
            Response.Cookies.Append("cook", token);
            return Ok(new { Token = token, Message = "User logged in" });
        }
        catch (UnauthorizedAccessException e)
        {
            return Unauthorized(e.Message);
        }
    }
    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string token)
    {
        var user = await _userRepository.GetAsync(u => u.VerificationToken == token);
        if (user == null)
        {
            return BadRequest(new {Message = "Неправильная ссылка подтверждения, или ваш аккаунт уже подтвержден"});
        }
        var result = await _usersService.ConfirmEmailAsync(user);
        if (result)
        {
            return Ok(new {Message = "Ваш аккаунт подтвержден"});
        }
        return BadRequest(new {Message = "Непредвиденная ошибка"});
        
    }
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(string email)
    {
        var user = await _userRepository.GetAsync(u => u.Email == email);
        if (user == null)
        {
            return NotFound(new {Message = "Пользователя с этой почтой не существует"});
        }
        var token = await _usersService.ForgotPassword(user);
        var result = await SendResetPasswordEmail(email, token);
        if (result)
        {
            return Ok(new {Message = "Теперь вы можете сбросить свой пароль, пожалуйста, проверьте свой почтовый ящик"});
        }
        return BadRequest( new {Message = "Письмо не может быть отправлено"});
        
    }
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        ValidationResult validationResult = await _resetPasswordRequestValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.ToDictionary());
        }
        var user = await _userRepository.GetAsync(u => u.PasswordResetToken == request.Token);
        if (user == null)
        {
            return NotFound("Invalid Token");
        }

        if (user.PasswordResetTokenExpires < DateTime.UtcNow)
        {
            return Forbid();
        }

        var result = await _usersService.ResetPassword(user, request.Password);
        if (result)
        {
            return Ok(new {Message = "Password changed"});
        }
        return BadRequest("Password not changed");
        
    }
    
    private async Task<bool> SendConfirmationEmail(string? email, string VerificationToken)
    {
        var confirmationLink = $"http://localhost:3000/confirm-email/{VerificationToken}";

        var emailBody = $@"
            <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 0;
                    }}
                    .container {{
                        width: 80%;
                        margin: 20px auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }}
                    .button {{
                        background-color: #007bff;
                        border: none;
                        color: white;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        margin: 4px 2px;
                        cursor: pointer;
                        border-radius: 5px;
                    }}
                    .footer {{
                        margin-top: 20px;
                        font-size: 14px;
                        color: #666666;
                    }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <p>Здравствуйте,</p>

                    <p>Мы отправили вам это письмо, чтобы подтвердить ваш адрес электронной почты на сайте WriteWave.</p>

                    <p>Для подтверждения вашего аккаунта, пожалуйста, нажмите на кнопку ниже:</p>

                    <a href='{confirmationLink}' class='button'>Подтвердить Email</a>

                    <p>Если вы не регистрировали аккаунт на нашем сайте, просто проигнорируйте это письмо.</p>
                </div>

                <div class='container footer'>
                    <p>С уважением,<br/>Команда WriteWave</p>
                </div>
            </body>
            </html>";

        var result = await _emailService.SendEmailAsync(email, "Подтверждение Email", emailBody);
        return result;
    }
    
   private async Task<bool> SendResetPasswordEmail(string? email, string VerificationToken)
    {
        var confirmationLink = $"http://localhost:3000/reset-password/{VerificationToken}";
        
        var emailBody = $@"
            <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 50px auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }}
                    .header {{
                        background-color: #007bff;
                        color: #ffffff;
                        padding: 20px;
                        text-align: center;
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                    }}
                    .content {{
                        padding: 20px;
                    }}
                    .button {{
                        display: inline-block;
                        padding: 15px 32px;
                        background-color: #007bff;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>Сброс пароля</h1>
                    </div>
                    <div class='content'>
                        <p>Здравствуйте,</p>

                        <p>Мы прислали вам это письмо, чтобы предоставить вам возможность сбросить пароль на сайте WriteWave.</p>

                        <p>Чтобы сбросить ваш пароль, просто нажмите на кнопку ниже:</p>

                        <a href='{confirmationLink}' class='button'>Сбросить пароль</a>

                        <p>Если вы не запрашивали сброс пароля, пожалуйста, проигнорируйте это письмо.</p>

                        <p>С уважением,<br/>Команда WriteWave</p>
                    </div>
                </div>
            </body>
            </html>";

        var result = await _emailService.SendEmailAsync(email, "Сброс пароля", emailBody);
        return result;
    }

    
}