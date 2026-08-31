using System.ComponentModel.DataAnnotations;
using FoodDeliveryApi.Models;

namespace FoodDeliveryApi.DTOs
{
    public class RegisterDto
    {
        [Required , EmailAddress]
        public string Email{get;set;} = string.Empty;
        [Required, MinLength(6)]
        public string Password {get;set;} = string.Empty;
        [Required]
        public string FullName { get; set; } = string.Empty;
        [Required]
        public UserRole Role { get; set; } 
        }

    public class LoginDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
        
    }

    public class AuthResponseDto
    {
        public string Token {get;set;} = string.Empty;
        public string Email {get;set;} = string.Empty;
        public string FullName {get;set;} = string.Empty;
        public string Role {get;set;} = string.Empty;

    }
}