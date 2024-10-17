
using Car_Rental_API.Entity;
using Car_Rental_API.Model;

namespace Car_Rental_API.IRepository
{
    public interface ICarRepository
    {
        Car CreateCar(Car car);
        ICollection<Car> GetCars();
        Car GetCarById(string id);
        CarUpdateRequest UpdateCar(string carId, CarUpdateRequest carUpdateRequest);
        void DeleteCar(string id);
    }
}
