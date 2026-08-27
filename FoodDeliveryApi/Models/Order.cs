using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodDeliveryApi.Models
{
    public class Order
    {
        [Key]
        public Guid Id{get;set;}

        public string CustomerId{get;set;} = string.Empty;
        public AppUser? Customer {get;set;}
        public Guid RestaurantId{get;set;}
        public Restaurant? Restaurant { get; set; }
        public string? DriverId{get;set;}
        public AppUser? Driver{get;set;}

        public OrderStatus status{get;set;} = OrderStatus.Pending; 

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    }

    public enum OrderStatus
    {
        Pending,
        Accepted,
        Ready,
        PickedUp,
        Delivered,
        Cancelled,


    }
}