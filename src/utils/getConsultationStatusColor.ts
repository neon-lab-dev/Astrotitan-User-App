export const getConsultationStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return '#D4AF37';
        case 'accepted':
            return '#2196F3';
        case 'rejected':
            return '#FF0000';
        case 'ended':
            return '#4CAF50';
        default:
            return '#8E8E93';
    }
};