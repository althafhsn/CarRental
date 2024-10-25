using Car_Rental_API.Entity;

namespace Car_Rental_API.IRepository
{
    public interface IRentalRequestRepository
    {
        RentalRequest AddRentalRequest(RentalRequest rentalRequest);
        ICollection<RentalRequest> GetRentalRequest();
        RentalRequest GetRentalRequestById(string rentalId);
        //bool UpdateRentalRequestStatus(string rentalId, string status);
        bool UpdateRentalRequestAction(string rentalId, string action);
    }
}
