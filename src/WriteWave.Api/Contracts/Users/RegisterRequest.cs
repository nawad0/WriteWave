using System.ComponentModel.DataAnnotations;

namespace WriteWave.Api.Contracts.Users;

using System.ComponentModel.DataAnnotations;

public class RegisterRequest
{
    [Required(ErrorMessage = "Имя пользователя обязательно")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Имя пользователя должно содержать от 3 до 50 символов")]
    public string? Username { get; set; }
    
    [Required(ErrorMessage = "Email обязателен")]
    [EmailAddress(ErrorMessage = "Недопустимый формат Email")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Пароль обязателен")]
    [StringLength(100, ErrorMessage = "Пароль должен содержать не менее {2} символов", MinimumLength = 6)]
    public string? Password { get; set; }
}


