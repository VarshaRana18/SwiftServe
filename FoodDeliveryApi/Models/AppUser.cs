using Microsoft.AspNetCore.Identity;

namespace FoodDeliveryApi.Models
{
    public class AppUser : IdentityUser{
        public string FullName {get;set;} = string.Empty;
        public UserRole Role{get;set;}
        public DateTime CreatedAt{get;set;} = DateTime.UtcNow;
    }
    public enum UserRole{
        Customer,Vendor,Driver,SuperAdmin
    }
}