using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodDeliveryApi.Models
{
    class MenuItem
    {
        [Key]
        public Guid Id{get;set;}

        public Guid RestaurantId{get;set;}
        public Restaurant? Restaurant { get; set; }

        [Required]
        public string Name{get;set;} = string.Empty;
        public string Description{get;set;} = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price{get;set;}
        public string? imageUrl{get;set;}
        public bool isAvailable{get;set;} =true;
        public int? StockQuantity { get; set; } // Null means Unlimited

        [Timestamp]
        public byte[] RowVersion {get;set;} = Array.Empty<byte>();
    }
}