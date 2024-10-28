namespace Car_Rental_API.Model
{
    public class UpdateActionRequest
    {
        public string RentalId { get; set; }
        public string CarId { get; set; }
        public string Action {  get; set; }
        public string CarStatus { get; set; }
    }
}
