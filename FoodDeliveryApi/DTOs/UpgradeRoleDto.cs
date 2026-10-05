using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryApi.DTOs
{
    public class UpgradeRoleDto
    {
        [Required]
        public string NewRole { get; set; } = string.Empty;
    }
}