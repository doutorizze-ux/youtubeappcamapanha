import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignAPI } from '../services/api';
import './CampaignForm.css';

function CampaignForm() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [formData, setFormData] = useState({
        name: '',
        platform: 'youtube',
        url: '',
        targetValue: '',
        provider: '',
        startDate: '',
        endDate: '',
        userId: user.id
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await campaignAPI.create(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao criar campanha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="campaign-form-container">
            <div className="container">
                <div className="form-wrapper fade-in">
                    <div className="form-header">
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard')}>
                            ← Voltar
                        </button>
                        <h1>Nova Campanha</h1>
                        <p className="text-muted">Preencha os dados da campanha para começar o monitoramento</p>
                    </div>

                    <form onSubmit={handleSubmit} className="campaign-form">
                        {error && <div className="alert alert-error">{error}</div>}

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Nome da Campanha</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ex: Lançamento Single - Artista X"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Plataforma</label>
                                <select
                                    name="platform"
                                    className="form-control"
                                    value={formData.platform}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="youtube">YouTube</option>
                                    <option value="spotify">Spotify</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">
                                    URL do {formData.platform === 'youtube' ? 'Vídeo' : 'Música/Álbum'}
                                </label>
                                <input
                                    type="url"
                                    name="url"
                                    className="form-control"
                                    value={formData.url}
                                    onChange={handleChange}
                                    placeholder={
                                        formData.platform === 'youtube'
                                            ? 'https://www.youtube.com/watch?v=...'
                                            : 'https://open.spotify.com/track/...'
                                    }
                                    required
                                />
                                <small className="form-hint">
                                    {formData.platform === 'youtube'
                                        ? 'Cole o link completo do vídeo do YouTube'
                                        : 'Cole o link da música ou álbum do Spotify'}
                                </small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Meta de {formData.platform === 'youtube' ? 'Visualizações' : 'Reproduções'}
                                </label>
                                <input
                                    type="text"
                                    name="targetValue"
                                    className="form-control"
                                    value={formData.targetValue}
                                    onChange={(e) => {
                                        // Remove tudo que não é dígito
                                        const value = e.target.value.replace(/\D/g, '');
                                        setFormData({ ...formData, targetValue: value });
                                    }}
                                    placeholder="Ex: 15000000"
                                    required
                                />
                                {formData.targetValue && (
                                    <small className="form-hint" style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>
                                        {parseInt(formData.targetValue).toLocaleString('pt-BR')}
                                        {parseInt(formData.targetValue) >= 1000000 ? ' (Milhões)' :
                                            parseInt(formData.targetValue) >= 1000 ? ' (Milhares)' : ''}
                                    </small>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Fornecedor Responsável</label>
                                <input
                                    type="text"
                                    name="provider"
                                    className="form-control"
                                    value={formData.provider}
                                    onChange={handleChange}
                                    placeholder="Ex: Fornecedor A"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Data de Início</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    className="form-control"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Data de Término</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    className="form-control"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-preview">
                            <h3>📋 Resumo da Campanha</h3>
                            <div className="preview-grid">
                                <div className="preview-item">
                                    <span className="preview-label">Campanha:</span>
                                    <span className="preview-value">{formData.name || '-'}</span>
                                </div>
                                <div className="preview-item">
                                    <span className="preview-label">Plataforma:</span>
                                    <span className="preview-value">
                                        {formData.platform === 'youtube' ? '▶️ YouTube' : '🎧 Spotify'}
                                    </span>
                                </div>
                                <div className="preview-item">
                                    <span className="preview-label">Meta:</span>
                                    <span className="preview-value">
                                        {formData.targetValue ? parseInt(formData.targetValue).toLocaleString() : '-'}
                                    </span>
                                </div>
                                <div className="preview-item">
                                    <span className="preview-label">Fornecedor:</span>
                                    <span className="preview-value">{formData.provider || '-'}</span>
                                </div>
                                <div className="preview-item">
                                    <span className="preview-label">Período:</span>
                                    <span className="preview-value">
                                        {formData.startDate && formData.endDate
                                            ? `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}`
                                            : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary btn-lg"
                                onClick={() => navigate('/dashboard')}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                            >
                                {loading ? 'Criando...' : 'Criar Campanha'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CampaignForm;
