using System.ComponentModel.DataAnnotations;
using FoodDeliveryApi.Models;

namespace FoodDeliveryApi.DTOs
{
    public class CreateMenuItemDto
    {
        [Required]
        public String Name{get;set;} = String.Empty;
        public string Description{get;set;} = string.Empty;

        [Required]
        [Range(0.01, 10000)]
        public decimal Price{get;set;}

        [Required]
        public Guid RestaurantId { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;
        public DietPreference DietaryPreference { get; set; } = DietPreference.Veg;
    }
}