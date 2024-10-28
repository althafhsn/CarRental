using Car_Rental_API.Entity;
using Car_Rental_API.Model;
using static Car_Rental_API.Repository.RentalRequestRepository;

namespace Car_Rental_API.IRepository
{
    public interface IRentalRequestRepository
    {
         Task<RentalRequest> AddRentalRequest(RentalRequest rentalRequest);
        Task<ICollection<RentalRequest>> GetRentalRequestAsync();
        Task<RentalRequest> GetRentalRequestById(string rentalId);
        //bool UpdateRentalRequestStatus(string rentalId, string status);
        Task<bool> UpdateRentalRequestAction(UpdateActionRequest updateAction);
        //ICollection<GetStatusRequest> GetRentalRequestStatus(string rentalId);

        //Task<bool> UpdateCarAndRentalRequest(string carId, string carStatus, string rentalId, string action);
        //Task<UpdateResult> UpdateCarAndRentalRequest(string carId, string carStatus, string rentalId, string action);


    }
}
