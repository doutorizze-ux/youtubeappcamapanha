import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function Dashboard({ setIsAuthenticated }) {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            const response = await campaignAPI.getAll();
            setCampaigns(response.data);
        } catch (error) {
            console.error('Error loading campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/login');
    };

    const handleValidate = async (id) => {
        try {
            await campaignAPI.validate(id);
            loadCampaigns();
        } catch (error) {
            console.error('Error validating campaign:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
            try {
                await campaignAPI.delete(id);
                loadCampaigns();
            } catch (error) {
                console.error('Error deleting campaign:', error);
                alert('Erro ao excluir campanha');
            }
        }
    };

    const filteredCampaigns = campaigns.filter(c => {
        if (filter === 'all') return true;
        if (filter === 'achieved') return c.status === 'achieved';
        if (filter === 'pending') return c.status === 'pending';
        if (filter === 'youtube') return c.platform === 'youtube';
        if (filter === 'spotify') return c.platform === 'spotify';
        return true;
    });

    const stats = {
        total: campaigns.length,
        achieved: campaigns.filter(c => c.status === 'achieved').length,
        pending: campaigns.filter(c => c.status === 'pending').length,
        youtube: campaigns.filter(c => c.platform === 'youtube').length,
        spotify: campaigns.filter(c => c.platform === 'spotify').length,
    };

    const chartData = campaigns.slice(0, 10).map(c => ({
        name: c.name.substring(0, 15) + '...',
        meta: c.targetValue,
        atual: c.currentValue,
        progresso: Math.round((c.currentValue / c.targetValue) * 100)
    }));

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando campanhas...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-content">
                        <div className="navbar-brand">
                            <img src="/logo.png" alt="Logo" className="navbar-logo" />
                        </div>
                        <div className="navbar-menu">
                            <span className="user-info">👤 {user.name}</span>
                            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                🚪 Sair
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="dashboard-header fade-in">
                    <div>
                        <h1>Dashboard</h1>
                        <p className="text-muted">Gerencie e monitore suas campanhas musicais</p>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/campaigns/new')}>
                        ➕ Nova Campanha
                    </button>
                </div>

                <div className="stats-grid fade-in">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--primary-gradient)' }}>📊</div>
                        <div className="stat-content">
                            <h3>{stats.total}</h3>
                            <p>Total de Campanhas</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--success-gradient)' }}>✅</div>
                        <div className="stat-content">
                            <h3>{stats.achieved}</h3>
                            <p>Metas Atingidas</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--secondary-gradient)' }}>⏳</div>
                        <div className="stat-content">
                            <h3>{stats.pending}</h3>
                            <p>Pendentes</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)' }}>▶️</div>
                        <div className="stat-content">
                            <h3>{stats.youtube}</h3>
                            <p>YouTube</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #1DB954 0%, #1aa34a 100%)' }}>🎧</div>
                        <div className="stat-content">
                            <h3>{stats.spotify}</h3>
                            <p>Spotify</p>
                        </div>
                    </div>
                </div>

                {campaigns.length > 0 && (
                    <div className="chart-section fade-in">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Progresso das Campanhas</h3>
                            </div>
                            <div className="card-body">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                        <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                        <YAxis stroke="var(--text-secondary)" />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: 'var(--radius-md)'
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="meta" fill="#667eea" name="Meta" />
                                        <Bar dataKey="atual" fill="#4facfe" name="Atual" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                <div className="campaigns-section fade-in">
                    <div className="section-header">
                        <h2>Campanhas</h2>
                        <div className="filter-buttons">
                            <button
                                className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter('all')}
                            >
                                Todas
                            </button>
                            <button
                                className={`btn btn-sm ${filter === 'achieved' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter('achieved')}
                            >
                                Atingidas
                            </button>
                            <button
                                className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter('pending')}
                            >
                                Pendentes
                            </button>
                            <button
                                className={`btn btn-sm ${filter === 'youtube' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter('youtube')}
                            >
                                YouTube
                            </button>
                            <button
                                className={`btn btn-sm ${filter === 'spotify' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter('spotify')}
                            >
                                Spotify
                            </button>
                        </div>
                    </div>

                    {filteredCampaigns.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>Nenhuma campanha encontrada</h3>
                            <p className="text-muted">Crie sua primeira campanha para começar</p>
                            <button className="btn btn-primary mt-3" onClick={() => navigate('/campaigns/new')}>
                                Criar Campanha
                            </button>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Campanha</th>
                                        <th>Plataforma</th>
                                        <th>Fornecedor</th>
                                        <th>Progresso</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCampaigns.map(campaign => {
                                        const progress = Math.round((campaign.currentValue / campaign.targetValue) * 100);
                                        return (
                                            <tr key={campaign.id}>
                                                <td>
                                                    <div className="campaign-name">{campaign.name}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`platform-badge ${campaign.platform}`}>
                                                        {campaign.platform === 'youtube' ? '▶️ YouTube' : '🎧 Spotify'}
                                                    </span>
                                                </td>
                                                <td>{campaign.provider}</td>
                                                <td>
                                                    <div className="progress-info">
                                                        <div className="progress-bar-container">
                                                            <div className="progress-bar" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                                        </div>
                                                        <span className="progress-text">
                                                            {campaign.currentValue.toLocaleString()} / {campaign.targetValue.toLocaleString()} ({progress}%)
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${campaign.status === 'achieved' ? 'badge-success' : 'badge-warning'}`}>
                                                        {campaign.status === 'achieved' ? 'Atingida' : 'Pendente'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={() => navigate(`/campaigns/${campaign.id}`)}
                                                        >
                                                            📄 Detalhes
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleValidate(campaign.id)}
                                                        >
                                                            🔄 Validar
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(campaign.id)}
                                                            style={{ background: '#ff4d4f', color: 'white', border: 'none' }}
                                                        >
                                                            🗑️ Excluir
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
