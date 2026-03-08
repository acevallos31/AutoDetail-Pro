import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { AuthLayout } from '../shared/layouts/AuthLayout';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <AuthLayout>
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
};
