using FluentValidation;
using WriteWave.Application.Contracts.Users;

namespace WriteWave.Application.Fluent;

public class ResetPasswordRequestValidator : AbstractValidator<ResetPasswordRequest>
{
    public ResetPasswordRequestValidator()
    {
        RuleFor(x => x.Token).NotEmpty().
            WithMessage("Токен обязателен");
        
        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль обязателен")
            .Length(6, 100).WithMessage("Пароль должен содержать не менее 6 символов")
            .Equal(x => x.ConfirmPassword).WithMessage("Пароли должны совпадать");
    }
}