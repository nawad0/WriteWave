using FluentValidation;
using WriteWave.Application.Contracts.Users;
using WriteWave.Domain.Interfaces.Repositories;

namespace WriteWave.Application.Fluent;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    private readonly IUserRepository _userRepository;

    public RegisterRequestValidator(IUserRepository userRepository)
    {
        _userRepository = userRepository;
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Имя пользователя обязательно")
            .Length(3, 50).WithMessage("Имя пользователя должно содержать от 3 до 50 символов")
            .MustAsync(BeUniqueUsername).WithMessage("Имя пользователя уже существует");
        
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email обязателен")
            .EmailAddress().WithMessage("Недопустимый формат Email")
            .MustAsync(BeUniqueEmail).WithMessage("Email уже существует");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль обязателен")
            .Length(6, 100).WithMessage("Пароль должен содержать не менее 6 символов")
            .Equal(x => x.ConfirmPassword).WithMessage("Пароли должны совпадать");
    }
    private async Task<bool> BeUniqueUsername(string username, CancellationToken cancellationToken)
    {
        var existingUser = await _userRepository.GetAsync(u => u.Username == username);
        return existingUser == null;
    }
    private async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
    {
        var existingUser = await _userRepository.GetAsync(u => u.Email == email);
        return existingUser == null;
    }
}