import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/items'); // nakon registracije idemo na Items stranicu
        } catch (err) {
            alert('Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <h2 className="text-2xl mb-4">Register</h2>
            <form onSubmit={handleSubmit}>
                <InputField label="Name" value={name} onChange={e => setName(e.target.value)} />
                <InputField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <InputField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <Button type="submit">Register</Button>
            </form>
        </div>
    );
};

export default Register;
