import { Suspense } from 'react';
import LoadingBar from '../components/LoadingBar';
import ResetPasswordForm from './ResetPasswordForm';


export default function ResetPasswordPage() {

  return (
    <Suspense fallback={<LoadingBar />}>
      <ResetPasswordForm />
    </Suspense>
  );
}