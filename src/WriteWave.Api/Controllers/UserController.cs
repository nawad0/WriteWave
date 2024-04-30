using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using WriteWave.Application.Minio;
using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Persistence.DTOs;

namespace WriteWave.Api.Controllers
{
    
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IMinioService _minioService;
        private readonly ISubscriptionRepository _subscriptionRepository;

        public UserController(IMinioService minioService, IUserRepository userRepository, IMapper mapper, ISubscriptionRepository subscriptionRepository)
        {
            _minioService = minioService;
            _userRepository = userRepository;
            _mapper = mapper;
            _subscriptionRepository = subscriptionRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetUser()
        {
            var userId = int.Parse(User.FindFirst("userId").Value);
            var user = await _userRepository.GetAsync(a => a.UserId == userId, includeProperties:"Subscriptions");
            
            if (user == null)
            {
                return NotFound();
            }
            return Ok(new { User = _mapper.Map<ProfileDTO>(user)});
            
        }
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            
            var user = await _userRepository.GetAsync(a => a.UserId == userId, includeProperties:"Subscriptions");
            var currentId = int.Parse(User.FindFirst("userId").Value);
            var subscription = await _subscriptionRepository.GetAsync(s => s.SubscriberUserId == currentId && s.TargetUserId == userId);
            bool UserSubscribed = subscription != null;


            if (user == null)
            {
                return NotFound();
            }
            return Ok(new { UserSubscribed = UserSubscribed, User = _mapper.Map<ProfileDTO>(user)});
            
        }
        [HttpPut]
        public async Task<IActionResult> UpdateUser(UserEditDTO userDto)
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

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpGet("subscriptions/{userId}")]
        [Authorize] 
        public async Task<IActionResult> GetUserSubscriptions(int userId)
        {
            var subscriptions = await _subscriptionRepository.GetAllAsync(filter: u => u.SubscriberUserId == userId);
            var users = await _userRepository.GetAllAsync(filter: u => subscriptions.Select(s => s.TargetUserId).Contains(u.UserId));
            
            return Ok(new {Subscriptions = _mapper.Map<List<UserDTO>>(users)});
        }
        [HttpGet("subscribers/{userId}")]
        [Authorize] 
        public async Task<IActionResult> GetUserSubscribers(int userId)
        {
            var subscriptions = await _subscriptionRepository.GetAllAsync(filter: u => u.TargetUserId == userId);
            var users = await _userRepository.GetAllAsync(filter: u => subscriptions.Select(s => s.SubscriberUserId).Contains(u.UserId));
            
            return Ok(new {Subscribers = _mapper.Map<List<UserDTO>>(users)});
        }
    }
}
