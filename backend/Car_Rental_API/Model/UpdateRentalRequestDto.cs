namespace Car_Rental_API.Model
{
    public class UpdateRentalRequestDto
    {
        public string CarId { get; set; }
        public string CarStatus { get; set; }
        public string RentalId { get; set; }
        public string Action { get; set; }
    }
}
