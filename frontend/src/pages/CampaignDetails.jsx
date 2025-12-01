import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './CampaignDetails.css';

function CampaignDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCampaign();
    }, [id]);

    const loadCampaign = async () => {
        try {
            const response = await campaignAPI.getById(id);
            setCampaign(response.data);
        } catch (error) {
            console.error('Error loading campaign:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = async () => {
        try {
            await campaignAPI.validate(id);
            loadCampaign();
        } catch (error) {
            console.error('Error validating campaign:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando detalhes...</p>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="container" style={{ paddingTop: '40px' }}>
                <div className="empty-state">
                    <h2>Campanha não encontrada</h2>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/dashboard')}>
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const progress = Math.round((campaign.currentValue / campaign.targetValue) * 100);
    const chartData = campaign.validations.map((v, index) => ({
        name: `Check ${index + 1}`,
        valor: v.value,
        data: new Date(v.checkedAt).toLocaleDateString()
    }));

    return (
        <div className="campaign-details">
            <div className="container">
                <div className="details-header fade-in">
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard')}>
                        ← Voltar ao Dashboard
                    </button>
                </div>

                <div className="details-grid fade-in">
                    <div className="details-main">
                        <div className="card">
                            <div className="card-header">
                                <div>
                                    <h1>{campaign.name}</h1>
                                    <div className="campaign-meta">
                                        <span className={`platform-badge ${campaign.platform}`}>
                                            {campaign.platform === 'youtube' ? '▶️ YouTube' : '🎧 Spotify'}
                                        </span>
                                        <span className={`badge ${campaign.status === 'achieved' ? 'badge-success' : 'badge-warning'}`}>
                                            {campaign.status === 'achieved' ? 'Meta Atingida' : 'Em Andamento'}
                                        </span>
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={handleValidate}>
                                    🔄 Validar Agora
                                </button>
                            </div>

                            <div className="card-body">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Fornecedor</span>
                                        <span className="info-value">{campaign.provider}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Período</span>
                                        <span className="info-value">
                                            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">URL</span>
                                        <a href={campaign.url} target="_blank" rel="noopener noreferrer" className="info-link">
                                            Abrir Link →
                                        </a>
                                    </div>
                                </div>

                                <div className="progress-section">
                                    <div className="progress-header">
                                        <h3>Progresso da Meta</h3>
                                        <span className="progress-percentage">{progress}%</span>
                                    </div>
                                    <div className="progress-bar-large">
                                        <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}>
                                            <span className="progress-label">
                                                {campaign.currentValue.toLocaleString()} / {campaign.targetValue.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="progress-stats">
                                        <div className="stat">
                                            <span className="stat-label">Atual</span>
                                            <span className="stat-value">{campaign.currentValue.toLocaleString()}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Meta</span>
                                            <span className="stat-value">{campaign.targetValue.toLocaleString()}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Faltam</span>
                                            <span className="stat-value">
                                                {Math.max(0, campaign.targetValue - campaign.currentValue).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {chartData.length > 0 && (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Evolução Histórica</h3>
                                </div>
                                <div className="card-body">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                            <XAxis dataKey="data" stroke="var(--text-secondary)" />
                                            <YAxis stroke="var(--text-secondary)" />
                                            <Tooltip
                                                contentStyle={{
                                                    background: 'var(--bg-secondary)',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 'var(--radius-md)'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="valor"
                                                stroke="#4facfe"
                                                strokeWidth={3}
                                                dot={{ fill: '#4facfe', r: 5 }}
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="details-sidebar">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Histórico de Validações</h3>
                            </div>
                            <div className="card-body">
                                {campaign.validations.length === 0 ? (
                                    <div className="empty-history">
                                        <p className="text-muted">Nenhuma validação realizada ainda</p>
                                    </div>
                                ) : (
                                    <div className="validation-list">
                                        {campaign.validations.slice().reverse().map((validation, index) => (
                                            <div key={validation.id} className="validation-item">
                                                <div className="validation-icon">
                                                    {index === 0 ? '🆕' : '📊'}
                                                </div>
                                                <div className="validation-content">
                                                    <div className="validation-value">
                                                        {validation.value.toLocaleString()}
                                                    </div>
                                                    <div className="validation-date">
                                                        {new Date(validation.checkedAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Ações Rápidas</h3>
                            </div>
                            <div className="card-body">
                                <div className="quick-actions">
                                    <button className="action-btn" onClick={handleValidate}>
                                        <span className="action-icon">🔄</span>
                                        <span>Validar Campanha</span>
                                    </button>
                                    <a
                                        href={campaign.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-btn"
                                    >
                                        <span className="action-icon">🔗</span>
                                        <span>Abrir no {campaign.platform === 'youtube' ? 'YouTube' : 'Spotify'}</span>
                                    </a>
                                    <button
                                        className="action-btn"
                                        onClick={() => {
                                            const report = `
RELATÓRIO DE CAMPANHA
======================
Campanha: ${campaign.name}
Plataforma: ${campaign.platform}
Fornecedor: ${campaign.provider}
Status: ${campaign.status}

Meta: ${campaign.targetValue.toLocaleString()}
Atual: ${campaign.currentValue.toLocaleString()}
Progresso: ${progress}%

Período: ${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}
                      `.trim();
                                            navigator.clipboard.writeText(report);
                                            alert('Relatório copiado para a área de transferência!');
                                        }}
                                    >
                                        <span className="action-icon">📋</span>
                                        <span>Copiar Relatório</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignDetails;
