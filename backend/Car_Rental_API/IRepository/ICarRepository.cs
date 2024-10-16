
using Car_Rental_API.Entity;
using Car_Rental_API.Model;

namespace Car_Rental_API.IRepository
{
    public interface ICarRepository
    {
        Car CreateCar(Car car);
        ICollection<Car> GetCars();
        Car GetCarById(int id);
        CarUpdateRequest UpdateCar(int carId, CarUpdateRequest carUpdateRequest);
        void DeleteCar(int id);
    }
}
