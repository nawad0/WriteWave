using System.ComponentModel.DataAnnotations;

namespace WriteWave.Api.Contracts.Users;

public class LoginRequest
{
    [Required(ErrorMessage = "Имя пользователя обязательно")]
    public string? Username { get; set; }

    [Required(ErrorMessage = "Пароль обязателен")]
    public string? Password { get; set; }
}
