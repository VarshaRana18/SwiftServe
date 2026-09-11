using System.ComponentModel.DataAnnotations;
using FoodDeliveryApi.Models;

namespace FoodDeliveryApi.DTOs
{
    public class CreateOrderDto
    {
        [Required]
        public Guid RestaurantId { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "Order must contain at least one item.")]
        public List<CreateOrderItemDto> Items { get; set; } = new List<CreateOrderItemDto>();
    }
    public class CreateOrderItemDto
    {
        [Required]
        public Guid MenuItemId { get; set; }
     
        [Required]
        [Range(1,100,ErrorMessage ="Quantity must be between 1 and 100.")]
        public int Quantity {get;set;}
    }

    public class UpdateOrderStatusDto
    {
        [Required]
        public OrderStatus Status { get; set; }
    }
}