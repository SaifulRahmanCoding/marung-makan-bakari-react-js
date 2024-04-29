import axiosInstance from '@/api/axiosInstance';

const TransactionService = () => {
    const getAll = async (query) => {
        const {data} = await axiosInstance.get("/bills", {params: query});
        return data;
    }
    const exportPdf = async (query) => {
        const {data} = await axiosInstance.get("/bills/export", {params: query});
        return data;
    }
    const create = async (payload) => {
        const {data} = await axiosInstance.post("/bills", payload);
        return data;
    }
    const getById = async (id) => {
        const {data} = await axiosInstance.get(`/bills/${id}`);
        return data;
    }
    return {
        getAll,
        getById,
        exportPdf,
        create,
    }
}
export default TransactionService;