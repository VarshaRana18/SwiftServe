using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryApi.DTOs
{
    public class CreateRestaurantDto
    {
        [Required]
        public String Name {get;set;} = String.Empty;

        [Required]
        public String Address {get;set;} = String.Empty;

        [Required]
        public string FullAddress { get; set; } = string.Empty;
        
        [Required]
        public string City { get; set; } = string.Empty;
        
        [Required]
        public string PinCode { get; set; } = string.Empty;
    }
}