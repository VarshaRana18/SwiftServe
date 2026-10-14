namespace FoodDeliveryApi.DTOs
{
    public class RestaurantSearchResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Image { get; set; } // Maps to ImageUrl
        public bool IsOpen { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public string? MatchReason { get; set; }
    }
}