export default interface ServiceResponse<T> {
    success: Boolean,
    data?: T,
    message?: string
};