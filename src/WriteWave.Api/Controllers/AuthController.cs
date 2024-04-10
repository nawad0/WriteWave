using Microsoft.AspNetCore.Mvc;
using WriteWave.Api.Contracts.Users;
using WriteWave.Application.Services;

namespace WriteWave.Api.Controllers;

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
{
    private readonly UsersService _usersService;

    public AuthController(UsersService usersService)
    {
        _usersService = usersService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromForm]RegisterRequest request)
    {
        await _usersService.Register(request.Username, request.Password, request.Email);
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromForm]LoginRequest request)
    {
        var token = await _usersService.Login(request.Username, request.Password);
        // Access HttpContext directly within action methods
        Response.Cookies.Append("cook", token);
        return Ok(token);
    }
}