import React, { useState } from 'react';
import { inscriptionService } from '../firebase/inscriptionService';
import '../css/payment-manager.css';

const PaymentManager = ({ inscription, onClose, onPaymentAdded }) => {
    // Determinar si el plan es por sesión
    const plansPorSesion = ['individual', 'pareja', 'trio'];
    const esPlanPorSesion = plansPorSesion.includes(inscription.planSeleccionado);
    
    const [paymentData, setPaymentData] = useState({
        monto: '',
        metodo: 'banco',
        concepto: esPlanPorSesion ? 'Pago sesión' : 'Pago plan',
        notas: '',
        // Campos específicos para sesiones
        numeroSesion: '',
        fechaSesion: '',
        esSesion: esPlanPorSesion
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

        // Validación específica para sesiones
        if (esPlanPorSesion) {
            if (!paymentData.numeroSesion || !paymentData.fechaSesion) {
                setError('Para planes por sesión, debes especificar el número de sesión y la fecha');
                return;
            }
        }

        setIsSubmitting(true);
        setError('');

        try {
            const result = await inscriptionService.addPayment(inscription.id, {
                ...paymentData,
                registradoPor: 'Administrador' // Aquí podrías usar el usuario actual
            });

            if (result.success) {
                const mensaje = esPlanPorSesion 
                    ? `Pago de sesión ${paymentData.numeroSesion} registrado correctamente`
                    : 'Pago registrado correctamente';
                alert(mensaje);
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
    
    // Para planes por sesión, calcular de manera diferente
    const calcularRestante = () => {
        if (esPlanPorSesion) {
            // Para planes por sesión, cada sesión es independiente
            return montoPlan; // Precio por sesión
        } else {
            // Para planes fijos (campus, mensual), calcular restante total
            return Math.max(0, montoPlan - totalPagado);
        }
    };
    
    const restante = calcularRestante();

    // Función para autocompletar el precio de la sesión
    const autocompletarPrecio = () => {
        if (esPlanPorSesion) {
            setPaymentData(prev => ({
                ...prev,
                monto: montoPlan.toString()
            }));
        } else {
            setPaymentData(prev => ({
                ...prev,
                monto: restante.toString()
            }));
        }
    };

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
                            <div className="monto-input-group">
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
                                <button 
                                    type="button" 
                                    className="btn-auto-price"
                                    onClick={autocompletarPrecio}
                                    disabled={isSubmitting}
                                    title={esPlanPorSesion ? "Precio por sesión" : "Cantidad restante"}
                                >
                                    €{esPlanPorSesion ? montoPlan : restante}
                                </button>
                            </div>
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

                    {/* Campos específicos para sesiones */}
                    {esPlanPorSesion && (
                        <div className="session-fields">
                            <h5>Información de la Sesión</h5>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="numeroSesion">Número de Sesión *</label>
                                    <input
                                        type="number"
                                        id="numeroSesion"
                                        name="numeroSesion"
                                        value={paymentData.numeroSesion}
                                        onChange={handleInputChange}
                                        placeholder="1, 2, 3..."
                                        min="1"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fechaSesion">Fecha de la Sesión *</label>
                                    <input
                                        type="date"
                                        id="fechaSesion"
                                        name="fechaSesion"
                                        value={paymentData.fechaSesion}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="concepto">Concepto</label>
                        <input
                            type="text"
                            id="concepto"
                            name="concepto"
                            value={paymentData.concepto}
                            onChange={handleInputChange}
                            placeholder={esPlanPorSesion ? "Ej: Sesión de entrenamiento" : "Ej: Pago campus, inscripción..."}
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
