using Car_Rental_API.Entity;

namespace Car_Rental_API.IRepository
{
    public interface IRentalRequestRepository
    {
        RentalRequest AddRentalRequest(RentalRequest rentalRequest);
        ICollection<RentalRequest> GetRentalRequest();
        RentalRequest GetRentalRequestById(string rentalId);
    }
}
