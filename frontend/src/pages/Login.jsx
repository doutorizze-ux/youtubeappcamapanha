import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

function Login({ setIsAuthenticated }) {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'manager'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                await authAPI.register(formData);
                setIsRegister(false);
                setError('');
                alert('Conta criada com sucesso! Faça login.');
            } else {
                const response = await authAPI.login({
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setIsAuthenticated(true);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao processar requisição');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="login-card fade-in">
                <div className="login-header">
                    <h1>🎵 New Music</h1>
                    <p className="text-muted">Validação automática de campanhas musicais</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="alert alert-error">{error}</div>}

                    {isRegister && (
                        <div className="form-group">
                            <label className="form-label">Nome</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Seu nome completo"
                                required={isRegister}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Senha</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {isRegister && (
                        <div className="form-group">
                            <label className="form-label">Perfil</label>
                            <select
                                name="role"
                                className="form-control"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="manager">Gestor de Campanha</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Processando...' : (isRegister ? 'Criar Conta' : 'Entrar')}
                    </button>
                </form>

                <div className="login-footer">
                    <button
                        type="button"
                        className="link-button"
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                        }}
                    >
                        {isRegister ? 'Já tem conta? Faça login' : 'Não tem conta? Registre-se'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
