using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryApi.DTOs
{
    public class CreateRestaurantDto
    {
        [Required]
        public String Name {get;set;} = String.Empty;
        [Required]
        public string Description{get;set;} = string.Empty;
        public string? ImageUrl { get; set; }

        [Required]
        public string FullAddress { get; set; } = string.Empty;
        
        [Required]
        public string City { get; set; } = string.Empty;
        
        [Required]
        public string PinCode { get; set; } = string.Empty;
        
        [Required]
        [Phone(ErrorMessage = "Invalid phone number format.")]
        public string ContactNumber { get; set; } = string.Empty;
    }

    public class UpdateRestaurantDto
    {
        [Required]
        public String Name {get;set;} = String.Empty;

        [Required]
        public string Description{get;set;} = string.Empty;
        public string? ImageUrl { get; set; }

        [Required]
        public string FullAddress { get; set; } = string.Empty;
        
        [Required]
        public string City { get; set; } = string.Empty;
        
        [Required]
        public string PinCode { get; set; } = string.Empty;
        
        [Required]
        [Phone(ErrorMessage = "Invalid phone number format.")]
        public string ContactNumber { get; set; } = string.Empty;
    }
}