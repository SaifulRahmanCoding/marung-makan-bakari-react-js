import axiosInstance from '@/api/axiosInstance';

const CustomerService = () => {
    const getAll = async (query) => {
        const { data } = await axiosInstance.get("/customers", { params: query });
        return data;
    }

    const create = async (payload) => {
        const { data } = await axiosInstance.post("/auth/register", payload);
        return data;
    }
    const createAdmin = async (payload) => {
        const { data } = await axiosInstance.post("/auth/register/admin", payload);
        return data;
    }
    const getById = async (id) => {
        const { data } = await axiosInstance.get(`/customers/${id}`);
        return data;
    }

    const update = async (payload) => {
        const { data } = await axiosInstance.put('/customers', payload);
        return data;
    }
    const updateStatus = async (id, statusMember) => {
        const { data } = await axiosInstance.put(`/customers/${id}?status=${statusMember}`);
        return data;
    }

    const deleteById = async (id) => {
        const { data } = await axiosInstance.delete(`/customers/${id}`);
        return data;
    }
    return {
        getAll,
        create,
        createAdmin,
        getById,
        update,
        updateStatus,
        deleteById,
    }
}

export default CustomerService;