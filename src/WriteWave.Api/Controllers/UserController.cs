using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WriteWave.Application.Minio;
using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Persistence.DTOs;

namespace WriteWave.Api.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMinioService _minioService;

        public UserController(IMinioService minioService, IUserRepository userRepository)
        {
            _minioService = minioService;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetUser()
        {
            var userId = int.Parse(User.FindFirst("userId").Value);
            var user = await _userRepository.GetAsync(a => a.UserId == userId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
            
        }
        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromForm] UserEditDTO userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = int.Parse(User.FindFirst("userId").Value);
            var user = await _userRepository.GetAsync(a => a.UserId == userId);
            if (user == null)
            {
                return NotFound();
            }

            try
            {
                var result = await _minioService.PutObject(userDto.UserImage);
                user.Username = userDto.Username;
                user.Email = userDto.Email;
                user.Image = result;
                await _userRepository.UpdateAsync(user);

                return Ok("Пользователь успешно обновлена");
            }
            catch (Exception ex)
            {
                // Log the exception for further investigation
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
