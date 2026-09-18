using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FoodDeliveryApi.Models
{
    public class Address
    {
        [Key]
        public Guid id { get; set; } 

        // Foreign Key to the User (Identity uses strings for IDs by default)
        [Required]
        public String AppUserId { get; set; } = string.Empty;

        public AppUser? AppUser { get; set; }

        [Required]
        public string Label { get; set; } = "Home"; 

        [Required]
        public string FullAddress { get; set; } = string.Empty;

        public string PinCode { get; set; } = string.Empty;
    }
}