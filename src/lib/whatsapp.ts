import type { BookingStatus } from './submissions.ts';

type BookingLike = {
  name?: string | null;
  phone?: string | null;
  service_type?: string | null;
  project_type?: string | null;
};

const statusCopy: Record<Exclude<BookingStatus, 'pending'>, string> = {
  approved: 'approved',
  rejected: 'rejected',
  completed: 'completed'
};

export const getWhatsAppPhone = (phone?: string | null) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';

  return digits.length === 10 ? `91${digits}` : digits;
};

export const getBookingStatusWhatsAppUrl = (booking: BookingLike, status: Exclude<BookingStatus, 'pending'>) => {
  const phone = getWhatsAppPhone(booking.phone);
  if (!phone) return '';

  const clientName = booking.name?.trim() || 'there';
  const projectName = booking.service_type || booking.project_type || 'your project request';
  const message = [
    `Hi ${clientName},`,
    '',
    `Your Deinxel ${projectName} booking has been ${statusCopy[status]}.`,
    status === 'approved' ? 'We will contact you shortly with the next steps.' : '',
    status === 'completed' ? 'Thank you for working with Deinxel.' : '',
    '',
    'Regards,',
    'Deinxel Digital Studio'
  ].filter(Boolean).join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
