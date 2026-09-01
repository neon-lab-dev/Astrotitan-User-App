export const getConsultationStatusLabel = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Pending';
        case 'accepted':
            return 'Accepted';
        case 'rejected':
            return 'Rejected';
        case 'ended':
            return 'Completed';
        default:
            return status || 'Unknown';
    }
};