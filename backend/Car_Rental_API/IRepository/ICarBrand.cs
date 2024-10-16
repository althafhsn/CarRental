using Car_Rental_API.Entity;

namespace Car_Rental_API.IRepository
{
    public interface ICarBrand
    {
        ICollection<CarBrand> GetBrands();
        CarBrand GetBrandById(int id);
    }
}
