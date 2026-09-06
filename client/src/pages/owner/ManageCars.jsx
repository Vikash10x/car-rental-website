import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageCars = () => {

    const { isOwner, axios, currency, fetchCars } = useAppContext()
    const [cars, setCars] = useState([])
    const [editingCar, setEditingCar] = useState(null)
    const [editData, setEditData] = useState({
        brand: '',
        model: '',
        pricePerDay: '',
        category: '',
        location: '',
        seating_capacity: '',
        fuel_type: '',
        transmission: '',
        description: ''
    })

    // function to fetch owner cars 
    const fetchOwnerCars = async () => {
        try {
            const { data } = await axios.get("/api/owner/cars")
            if (data.success) {
                setCars(data.cars)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to toggle availbility 
    const toggleAvailability = async (carId) => {
        try {
            const { data } = await axios.post("/api/owner/toggle-car", { carId })
            if (data.success) {
                toast.success(data.message)
                fetchOwnerCars()
                fetchCars()

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to delete car 
    const deleteCar = async (carId) => {
        try {

            const confirm = window.confirm("Are you sure you want to delete this car?")

            if (!confirm) return null

            const { data } = await axios.post("/api/owner/delete-car", { carId })
            if (data.success) {
                toast.success(data.message)
                fetchOwnerCars()
                fetchCars()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleEditClick = (car) => {
        setEditingCar(car)
        setEditData({
            brand: car.brand || '',
            model: car.model || '',
            pricePerDay: car.pricePerDay || '',
            category: car.category || '',
            location: car.location || '',
            seating_capacity: car.seating_capacity || '',
            fuel_type: car.fuel_type || '',
            transmission: car.transmission || '',
            description: car.description || ''
        })
    }

    const handleUpdateCar = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post('/api/owner/update-car', {
                carId: editingCar._id,
                carData: editData
            })
            if (data.success) {
                toast.success(data.message)
                setEditingCar(null)
                fetchOwnerCars()
                fetchCars()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        isOwner && fetchOwnerCars()
    }, [isOwner])

    return (
        <div className='px-4 pt-10 md:px-10 w-full relative'>
            <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform" />

            <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    <thead className='text-gray-500'>
                        <tr>
                            <th className='p-3 font-medium'>Car</th>
                            <th className='p-3 font-medium max-md:hidden'>Category</th>
                            <th className='p-3 font-medium'>Price</th>
                            <th className='p-3 font-medium max-md:hidden'>Status</th>
                            <th className='p-3 font-medium'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car, index) => (
                            <tr key={index} className='border-t border-borderColor'>
                                <td className='p-3 flex items-center gap-3'>
                                    <img src={car.image} alt='' className='h-12 w-12 aspect-square object-cover rounded-md' />
                                    <div className='max-md:hidden'>
                                        <p className='font-medium'>{car.brand} {car.model}</p>
                                        <p className='text-xs text-gray-500'>{car.seating_capacity} • {car.transmission}</p>
                                    </div>
                                </td>

                                <td className='max-md:hidden p-3'>{car.category}</td>
                                <td className='p-3'>{currency}{car.pricePerDay}/day</td>

                                <td className='max-md:hidden p-3'>
                                    <span className={`px-3 py-1 rounded-full text-xs ${car.isAvaliable ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                                        {car.isAvaliable ? "Available" : "Unavailable"}
                                    </span>
                                </td>

                                <td className='flex items-center p-3'>
                                    <img onClick={() => handleEditClick(car)} src={assets.edit_icon} alt="Edit" className='cursor-pointer' title="Edit Car" />
                                    <img onClick={() => toggleAvailability(car._id)} src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon} className='cursor-pointer' title="Toggle Availability" />
                                    <img onClick={() => deleteCar(car._id)} src={assets.delete_icon} className='cursor-pointer' title="Delete Car" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Car Modal */}
            {editingCar && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100'>
                        <div className='flex justify-between items-center mb-4 border-b pb-3'>
                            <h2 className='text-xl font-semibold text-gray-800'>Edit Car Details</h2>
                            <button onClick={() => setEditingCar(null)} className='text-gray-400 hover:text-gray-600 text-xl font-bold p-1'>✕</button>
                        </div>

                        <form onSubmit={handleUpdateCar} className='flex flex-col gap-4 text-sm text-gray-600'>
                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block font-medium mb-1'>Brand</label>
                                    <input
                                        type='text'
                                        value={editData.brand}
                                        onChange={(e) => setEditData({ ...editData, brand: e.target.value })}
                                        className='w-full p-2 border border-gray-200 rounded outline-primary'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block font-medium mb-1'>Model</label>
                                    <input
                                        type='text'
                                        value={editData.model}
                                        onChange={(e) => setEditData({ ...editData, model: e.target.value })}
                                        className='w-full p-2 border border-gray-200 rounded outline-primary'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block font-medium mb-1'>Daily Price ({currency})</label>
                                    <input
                                        type='number'
                                        value={editData.pricePerDay}
                                        onChange={(e) => setEditData({ ...editData, pricePerDay: e.target.value })}
                                        className='w-full p-2 border border-gray-200 rounded outline-primary font-semibold text-primary'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block font-medium mb-1'>Location</label>
                                    <input
                                        type='text'
                                        value={editData.location}
                                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                        className='w-full p-2 border border-gray-200 rounded outline-primary'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-3 gap-3'>
                                <div>
                                    <label className='block font-medium mb-1'>Category</label>
                                    <input
                                        type='text'
                                        value={editData.category}
                                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                        className='w-full p-2 border border-gray-200 rounded outline-primary'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block font-medium mb-1'>Seats</label>
                                    <input
                                        type='number'
                                        value={editData.seating_capacity}
                                        onChange={(e) => setEditData({ ...editData, seating_capacity: e.target.value })}
                                        className='w-full p-2 border border-gray-200 rounded outline-primary'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block font-medium mb-1'>Fuel</label>
                                    <input
                                        type='text'
                                        value={editData.fuel_type}
                                        onChange={(e) => setEditData({ ...editData, fuel_type: e.target.value })}
                                        className='w-full p-2 border border-gray-200 rounded outline-primary'
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block font-medium mb-1'>Transmission</label>
                                <input
                                    type='text'
                                    value={editData.transmission}
                                    onChange={(e) => setEditData({ ...editData, transmission: e.target.value })}
                                    className='w-full p-2 border border-gray-200 rounded outline-primary'
                                    required
                                />
                            </div>

                            <div>
                                <label className='block font-medium mb-1'>Description</label>
                                <textarea
                                    rows='3'
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                    className='w-full p-2 border border-gray-200 rounded outline-primary'
                                    required
                                />
                            </div>

                            <div className='flex justify-end gap-3 mt-3 pt-3 border-t'>
                                <button
                                    type='button'
                                    onClick={() => setEditingCar(null)}
                                    className='px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='px-4 py-2 text-white bg-primary hover:bg-blue-800 rounded-md transition-colors font-medium'
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageCars