using System.ComponentModel.DataAnnotations;

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
        public List<string> Roles { get; set; } = new List<string> { "Customer" };
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
        public List<string> Roles { get; set; } = new List<string>();

    }

    public class UpdateProfileDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [RegularExpression(@"^(\+\d{1,3}[- ]?)?\d{10}$", ErrorMessage = "Invalid phone number format. Must be 10 digits.")]
        public string? PhoneNumber { get; set; }
    }
}