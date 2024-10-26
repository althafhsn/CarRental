using Car_Rental_API.Entity;
using Car_Rental_API.Model;

namespace Car_Rental_API.IRepository
{
    public interface IRentalRequestRepository
    {
        RentalRequest AddRentalRequest(RentalRequest rentalRequest);
        ICollection<RentalRequest> GetRentalRequest();
        RentalRequest GetRentalRequestById(string rentalId);
        //bool UpdateRentalRequestStatus(string rentalId, string status);
        bool UpdateRentalRequestAction(UpdateActionRequest updateAction);
        //ICollection<GetStatusRequest> GetRentalRequestStatus(string rentalId);


    }
}
