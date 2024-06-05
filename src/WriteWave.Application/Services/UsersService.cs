
using System.Security.Cryptography;
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
                Role = Roles.User,
                VerificationToken = GenerateToken()
                
            };

            await _userRepository.CreateAsync(user);
        }
        public async Task<bool> ConfirmEmailAsync(User user)
        {
            user.VerifiedAt = DateTime.UtcNow;
            user.EmailConfirmed = true;
            await _userRepository.UpdateAsync(user);
            return true;
        }
        public async Task<string> ForgotPassword(User user)
        {
            user.PasswordResetToken = GenerateToken();
            user.PasswordResetTokenExpires = DateTime.UtcNow.AddDays(1);
            await _userRepository.UpdateAsync(user);
            return user.PasswordResetToken;
        }

        public async Task<string> Login(string username, string password)
        {
            var user = await _userRepository.GetAsync(u => u.Username == username || u.Email == username);
            if (user.VerifiedAt == null)
            {
                throw new UnauthorizedAccessException("User not verified");
            }

            try
            {
                var result = _passwordHasher.Verify(password, user.Password);
                if (result == false) 
                {
                    return null;
                }
                var token = _jwtProvider.GenerateToken(user);
                return token;
            }
            catch (BCrypt.Net.SaltParseException e)
            {
                var result = password==user.Password;
                if (result == false)
                {
                    return null;
                }
                var token = _jwtProvider.GenerateToken(user);
                return token;
            }
            
        }
        

        private string GenerateToken()
        {
           return Convert.ToHexString(RandomNumberGenerator.GetBytes(64)); 
        }

        public async Task<bool> ResetPassword(User user, string? requestPassword)
        {
            var hashedPassword = _passwordHasher.Generate(requestPassword);
            user.Password = hashedPassword;
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpires = null;
            await _userRepository.UpdateAsync(user);
            return true;
        }
    }
}

