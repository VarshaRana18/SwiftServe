using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryApi.DTOs
{
    public class UpdateDriverPhoneDto
    {
        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}