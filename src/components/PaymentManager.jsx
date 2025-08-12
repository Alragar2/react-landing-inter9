import React, { useState } from 'react';
import { inscriptionService } from '../firebase/inscriptionService';
import '../css/payment-manager.css';

const PaymentManager = ({ inscription, onClose, onPaymentAdded }) => {
    const [paymentData, setPaymentData] = useState({
        monto: '',
        metodo: 'banco',
        concepto: 'Pago campus',
        notas: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!paymentData.monto || parseFloat(paymentData.monto) <= 0) {
            setError('El monto debe ser mayor a 0');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const result = await inscriptionService.addPayment(inscription.id, {
                ...paymentData,
                registradoPor: 'Administrador' // Aquí podrías usar el usuario actual
            });

            if (result.success) {
                alert('Pago registrado correctamente');
                onPaymentAdded();
                onClose();
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error al registrar pago:', error);
            setError('Error inesperado al registrar el pago');
        } finally {
            setIsSubmitting(false);
        }
    };

    const montoPlan = inscription.precioTotal || 120; // Usar precio del plan o 120 por defecto
    const totalPagado = inscription.totalPagado || 0;
    const restante = Math.max(0, montoPlan - totalPagado);

    return (
        <div className="payment-manager-overlay" onClick={onClose}>
            <div className="payment-manager-content" onClick={(e) => e.stopPropagation()}>
                <div className="payment-manager-header">
                    <h3>Registrar Pago</h3>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="payment-summary">
                    <h4>{inscription.nombreNino} {inscription.apellidos}</h4>
                    {inscription.planSeleccionado && (
                        <div className="plan-info">
                            <span className="plan-selected">Plan: {inscription.planSeleccionado}</span>
                        </div>
                    )}
                    <div className="payment-amounts">
                        <div className="amount-item">
                            <span className="label">Precio Total:</span>
                            <span className="value">€{montoPlan}</span>
                        </div>
                        <div className="amount-item">
                            <span className="label">Total Pagado:</span>
                            <span className="value paid">€{totalPagado}</span>
                        </div>
                        <div className="amount-item">
                            <span className="label">Restante:</span>
                            <span className={`value ${restante > 0 ? 'pending' : 'complete'}`}>
                                €{restante}
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="payment-form">
                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-triangle"></i>
                            {error}
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="monto">Monto *</label>
                            <input
                                type="number"
                                id="monto"
                                name="monto"
                                value={paymentData.monto}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="metodo">Método de Pago *</label>
                            <select
                                id="metodo"
                                name="metodo"
                                value={paymentData.metodo}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="banco">🏦 Transferencia Bancaria</option>
                                <option value="mano">💵 Pago en Mano</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="concepto">Concepto</label>
                        <input
                            type="text"
                            id="concepto"
                            name="concepto"
                            value={paymentData.concepto}
                            onChange={handleInputChange}
                            placeholder="Ej: Pago campus, inscripción..."
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="notas">Notas (opcional)</label>
                        <textarea
                            id="notas"
                            name="notas"
                            value={paymentData.notas}
                            onChange={handleInputChange}
                            placeholder="Información adicional sobre el pago..."
                            rows="3"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Registrando...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-credit-card"></i>
                                    Registrar Pago
                                </>
                            )}
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="btn-cancel"
                            disabled={isSubmitting}
                        >
                            <i className="fas fa-times"></i>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentManager;
