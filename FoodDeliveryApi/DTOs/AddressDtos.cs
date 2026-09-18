using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryApi.DTOs
{
    public class CreateAddressDto
    {
        [Required]
        public string Label { get; set; } = "Home";

        [Required]
        public string FullAddress { get; set; } = string.Empty;

        [Required]
        public string PinCode { get; set; } = string.Empty;
    }
}