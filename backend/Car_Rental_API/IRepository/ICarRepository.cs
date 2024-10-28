
using Car_Rental_API.Entity;
using Car_Rental_API.Model;
using System.Threading.Tasks;

namespace Car_Rental_API.IRepository
{
    public interface ICarRepository
    {
        Task<Car> CreateCar(Car car);
        Task<ICollection<Car>> GetCars();
        Task<Car> GetCarById(string carId);
        Task<CarUpdateRequest> UpdateCar(string carId, CarUpdateRequest carUpdateRequest);
        void DeleteCar(string id);
        Task<UpdateCarStatusRequest> UpdateCarStatus(string carId, UpdateCarStatusRequest updateCarStatus);
    }
}
