import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/items'); // nakon login-a idemo na Items stranicu
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <h2 className="text-2xl mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
                <InputField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <InputField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <Button type="submit">Login</Button>
            </form>
        </div>
    );
};

export default Login;
