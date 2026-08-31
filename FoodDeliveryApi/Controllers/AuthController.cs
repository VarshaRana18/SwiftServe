using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FoodDeliveryApi.DTOs;
using FoodDeliveryApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace FoodDeliveryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _config;

        public AuthController(UserManager<AppUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            // 1. Check if user exists
            if (await _userManager.FindByEmailAsync(dto.Email) != null)
            {
                return BadRequest("User with this email already exists.");
            }

            // 2. Map DTO to User Model
            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                Role = dto.Role
            };

            // 3. Save to databse with hashed password
            var result = await _userManager.CreateAsync(user,dto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            return Ok("User Registered Successfully");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            // 1. Find User
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if(user == null)
            {
                return Unauthorized("Invalid email");
            }

            // 2. Check Password
            var isPasswordValid = await _userManager.CheckPasswordAsync(user,dto.Password);
            if(!isPasswordValid) return Unauthorized("Invalid Password");

            // 3. Generate JWT Token
            var token = GenerateJwtToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Email = user.Email!,
                FullName = user.FullName,
                Role = user.Role.ToString()
            });
        }

        private string GenerateJwtToken(AppUser user)
        {
            // Create the claims (the data/payload stored inside the token)
            var claims = new[]
            {
              new Claim(JwtRegisteredClaimNames.Sub,user.Id),  
              new Claim(JwtRegisteredClaimNames.Email,user.Email!),  
              new Claim(ClaimTypes.Role,user.Role.ToString())  
            };

            // Get the secret key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Build the token
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7), // Token valid for 7 days
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}