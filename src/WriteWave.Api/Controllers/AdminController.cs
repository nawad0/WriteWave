using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Domain.Models;
using WriteWave.Infrastructure.Auth;

namespace WriteWave.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

[ApiController]
[Route("[controller]")]
public class AdminController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly JwtProvider _jwtProvider;

    // public AdminController(IUserRepository userRepository, JwtProvider jwtProvider)
    // {
    //     _userRepository = userRepository;
    //     _jwtProvider = jwtProvider;
    // }
    //
    // [HttpPost("add-admin")]
    // public async Task<IActionResult> AddAdmin(string userEmail)
    // {
    //     // Получаем текущего пользователя из HttpContext
    //     var contextUser = HttpContext.User;
    //
    //     // Получаем пользователя из хранилища данных по адресу электронной почты
    //     var userIdClaim = contextUser.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
    //     var currentUser = new User();
    //     if (userIdClaim != null && int.TryParse(userIdClaim, out int userId))
    //     {
    //         currentUser = await _userRepository.GetUserAsync(userId);
    //         // Используйте currentUser для дальнейших операций
    //     }
    //     else
    //     {
    //         return Forbid(); 
    //     }
    //     
    //     // Проверяем, имеет ли текущий пользователь право добавлять администраторов
    //     
    //     // Получаем пользователя по электронной почте
    //     var user = await _userRepository.GetByEmail(userEmail);
    //
    //     if (user == null)
    //     {
    //         return NotFound($"Пользователь с электронной почтой {userEmail} не найден.");
    //     }
    //
    //     // Проверяем, имеет ли текущий пользователь право добавлять администраторов
    //     if (!_jwtProvider.CanAddAdmin(currentUser, user))
    //     {
    //         return Forbid(); // Возвращаем статус 403 Forbidden, если у пользователя нет прав администратора
    //     }
    //
    //     // Добавляем роль администратора пользователю, если ее еще нет
    //     user.Role = Roles.Admin;
    //     _userRepository.UpdateAsync(user);
    //
    //     return Ok();
    //
    // }
    [HttpGet("current")]
    public IActionResult GetCurrentUser()
    {
        // Получение идентификатора пользователя из утверждений токена
        var userIdClaim = User.FindFirst("userId");
        if (userIdClaim == null)
        {
            return BadRequest("Пользователь не найден");
        }

        var userId = int.Parse(userIdClaim.Value);

        // Дополнительно, если вам нужно получить другие данные о пользователе, например, его роль, вы можете добавить их к утверждениям токена при генерации токена.
        var roleClaim = User.FindFirst(ClaimTypes.Role);
        var username = User.FindFirst("username").Value;
        var role = roleClaim?.Value;

        // В этом месте вы можете использовать полученные данные для выполнения логики вашего приложения.
        // Например, получить данные о текущем пользователе из базы данных или еще откуда-то.

        // Вернуть информацию о текущем пользователе
        return Ok(new { UserId = userId, Role = role, Username = username });
    }
}
