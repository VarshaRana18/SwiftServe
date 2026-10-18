using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryApi.DTOs
{
    public class UpdateDriverPhoneDto
    {
        [Required]
        [RegularExpression(@"^(\+\d{1,3}[- ]?)?\d{10}$", ErrorMessage = "Invalid phone number format. Must be 10 digits.")]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}