using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using FoodDeliveryApi.Models;

namespace FoodDeliveryApi.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {}
        public DbSet<Restaurant> Restaurants{get;set;}
        public DbSet<MenuItem> MenuItems{get;set;}
        public DbSet<Order> Orders{get;set;}
        public DbSet<OrderItem> OrderItems{get;set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); 

            builder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany()
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Order>()
                .HasOne(o => o.Driver)
                .WithMany()
                .HasForeignKey(o => o.DriverId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        }
    }
