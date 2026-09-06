using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryApi.DTOs
{
    public class CreateRestaurantDto
    {
        [Required]
        public String Name {get;set;} = String.Empty;

        [Required]
        public String Address {get;set;} = String.Empty;
    }
}