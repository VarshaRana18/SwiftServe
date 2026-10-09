using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryApi.Models{
    public class Restaurant
    {
        [Key]
        public Guid Id{get;set;}

        [Required]
        public string OwnerId{get;set;}= string.Empty;
        public AppUser? Owner{get;set;}    
        
        [Required]
        public string Name{get;set;} = string.Empty;
        public string Description{get;set;} = string.Empty;


        [Required]
        [Phone(ErrorMessage = "Invalid phone number format.")]
        public string ContactNumber { get; set; } = string.Empty;

        [Required]
        public string FullAddress { get; set; } = string.Empty; 
        
        [Required]
        public string City { get; set; } = string.Empty;
        
        [Required]
        public string PinCode { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }
        
        public bool IsActive {get;set;} = true;// Admin control
        public bool IsOpen {get;set;} = true;// Vendor control

        public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
        public ICollection<Order> Orders = new List<Order>();
    }

}