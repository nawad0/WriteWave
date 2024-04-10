
using WriteWave.Application.Auth;
using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Domain.Models;

namespace WriteWave.Application.Services
{
    public class UsersService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtProvider _jwtProvider;

        private readonly IPasswordHasher _passwordHasher;
        public UsersService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
        }
        public async Task Register(string userName, string password, string email) 
        {
            var hashedPassword = _passwordHasher.Generate(password);
            var user = new User()
            {
                
                Username = userName,
                Email = email,
                Password = hashedPassword,
                Role = Roles.User
                 

            };

            await _userRepository.CreateAsync(user);
        }
        public async Task<string> Login(string username, string password)
        {
            var user = await _userRepository.GetByUserName(username);
            var result = _passwordHasher.Verify(password, user.Password);
            if (result == false) 
            {
                throw new Exception("Failed");
            }
            var token = _jwtProvider.GenerateToken(user);
            return token;
        }
    }
}

