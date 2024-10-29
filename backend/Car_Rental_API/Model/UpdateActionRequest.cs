namespace Car_Rental_API.Model
{
    public class UpdateActionRequest
    {
        public string RentalId { get; set; }
        public string Action {  get; set; }
    }

    public class UpdatgeReturnRequest
    {
        public string RentalId { get; set; }
        public string Status { get; set; }
    }
}
