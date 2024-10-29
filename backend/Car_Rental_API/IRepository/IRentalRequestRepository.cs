using Car_Rental_API.Entity;
using Car_Rental_API.Model;
using static Car_Rental_API.Repository.RentalRequestRepository;

namespace Car_Rental_API.IRepository
{
    public interface IRentalRequestRepository
    {
        Task<RentalRequest> AddRentalRequest(RentalRequest rentalRequest);
        Task<ICollection<RentalRequest>> GetRentalRequest();
        Task<RentalRequest> GetRentalRequestById(string rentalId);

        Task<bool> UpdateRentalRequestAction(UpdateActionRequest updateAction);
        Task<bool> UpdateRentalReturn(UpdatgeReturnRequest updateReturn);

    }
}
