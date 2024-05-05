using FluentValidation;
using WriteWave.Application.Contracts.Users;
using WriteWave.Domain.Interfaces.Repositories;

namespace WriteWave.Application.Fluent;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    private readonly IUserRepository _userRepository;

    public LoginRequestValidator(IUserRepository userRepository)
    {
        _userRepository = userRepository;
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Имя пользователя обязательно")
            .MustAsync(IsUserExists).WithMessage("Пользователь не существует");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль обязателен");
    }
    private async Task<bool> IsUserExists(string? username, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetAsync(u => u.Username == username);
        return user != null;
    }
    
}