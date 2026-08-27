using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryApi.Models{
    class Restaurant
    {
        [Key]
        public Guid Id{get;set;}

        [Required]
        public string OwnerId{get;set;}= string.Empty;
        public AppUser? Owner{get;set;}    
        
        [Required]
        public string Name{get;set;} = string.Empty;
        public string Description{get;set;} = string.Empty;
        public string Address{get;set;} = string.Empty;  
        
        public bool isActive {get;set;} = true;// Admin control
        public bool isOpen {get;set;} = true;// Vendor control

        public ICollection<MenuItem> MenuItems = new List<MenuItem>();
        public ICollection<Order> Orders= new List<Order>();
    }

}