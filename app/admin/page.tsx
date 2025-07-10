import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to the messages page where the actual admin functionality is
  redirect('/admin/messages');
} 