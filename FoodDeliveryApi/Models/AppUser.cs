using Microsoft.AspNetCore.Identity;

namespace FoodDeliveryApi.Models
{
    public class AppUser : IdentityUser{
        public string FullName {get;set;} = string.Empty;
        public List<string> Roles{get;set;} = new List<string>();
        public DateTime CreatedAt{get;set;} = DateTime.UtcNow;
    }
}