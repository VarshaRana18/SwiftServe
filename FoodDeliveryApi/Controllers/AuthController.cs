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
            // 0. Validate that at least one role is provided
            if (dto.Roles == null || dto.Roles.Count == 0)
            {
                return BadRequest("At least one role must be provided to create or update an account.");
            }

            // 1. Check if user exists
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);

            if(existingUser != null)
            {
                // SECURITY CHECK: Prove they own this account before adding roles!
                var isPasswordValid = await _userManager.CheckPasswordAsync(existingUser, dto.Password);

                if (!isPasswordValid)
                {
                    return BadRequest("An account with this email exists, but the password provided is incorrect.");
                }

                // 2. Merge new roles, ignoring duplicates
                bool rolesAdded = false;

                foreach(var role in dto.Roles)
                {
                    if (!existingUser.Roles.Contains(role))
                    {
                        existingUser.Roles.Add(role);
                        rolesAdded = true;
                    }
                }

                // 3. Save changes if any new roles were actually added
                if (rolesAdded)
                {
                    var updateResult = await _userManager.UpdateAsync(existingUser);
                    if (!updateResult.Succeeded) return BadRequest(updateResult.Errors);

                    return Ok("New role(s) successfully added to your existing account.");
                }

                return Ok("Your account already has these roles.");
            }

            // 2. Map DTO to User Model
            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                Roles = dto.Roles
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
                Roles = user.Roles
            });
        }

        private string GenerateJwtToken(AppUser user)
        {
            // Create the claims (the data/payload stored inside the token)
            var claims = new List<Claim>
            {
              new Claim(JwtRegisteredClaimNames.Sub,user.Id),  
              new Claim(JwtRegisteredClaimNames.Email,user.Email!),  
            };

            if(user.Roles != null)
            {
                foreach(var role in user.Roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }
            }
            

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