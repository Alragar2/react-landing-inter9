import React, { useState } from 'react';
import { inscriptionService } from '../firebase/inscriptionService';

const InscriptionForm = ({ isVisible, onClose }) => {
    const [formData, setFormData] = useState({
        nombreNino: '',
        apellidos: '',
        fechaNacimiento: '',
        edad: '',
        categoria: '',
        demarcacion: '',
        talla: '',
        lateralidad: '',
        nombreTutor: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        alergias: '',
        informacionInteres: '',
        autorizacion: false,
        politicaPrivacidad: false
    });

    const [touchedFields, setTouchedFields] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Función para determinar si un campo es inválido
    const isFieldInvalid = (fieldName, fieldValue) => {
        // Para campos select, siempre validar si están vacíos
        if (['categoria', 'demarcacion', 'talla', 'lateralidad'].includes(fieldName)) {
            return !fieldValue || fieldValue === '' || fieldValue.trim() === '';
        }
        // Para otros campos, solo validar si han sido tocados
        return touchedFields[fieldName] && (!fieldValue || fieldValue === '' || fieldValue.trim() === '');
    };

    // Función para determinar si un campo es válido y debe mostrarse en verde
    const isFieldValid = (fieldName, fieldValue) => {
        // Para campos select, mostrar verde si tienen un valor válido
        if (['categoria', 'demarcacion', 'talla', 'lateralidad'].includes(fieldName)) {
            return fieldValue && fieldValue !== '' && fieldValue.trim() !== '';
        }
        // Para otros campos, solo si han sido tocados y tienen valor
        return touchedFields[fieldName] && fieldValue && fieldValue !== '' && fieldValue.trim() !== '';
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Marcamos como touched cuando se cambia cualquier valor
        setTouchedFields(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouchedFields(prev => ({
            ...prev,
            [name]: true
        }));
    };

    // Manejar el focus para marcar inmediatamente como touched en selects
    const handleFocus = (e) => {
        const { name } = e.target;
        if (e.target.tagName.toLowerCase() === 'select') {
            setTouchedFields(prev => ({
                ...prev,
                [name]: true
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validar datos antes de enviar
            const validation = inscriptionService.validateInscriptionData(formData);

            if (!validation.isValid) {
                alert(validation.message);
                setIsSubmitting(false);
                return;
            }

            // Enviar datos a Firebase
            const result = await inscriptionService.createInscription(formData);

            if (result.success) {
                alert('¡Inscripción enviada correctamente! Nos pondremos en contacto contigo pronto.');

                // Reset form
                setFormData({
                    nombreNino: '',
                    apellidos: '',
                    fechaNacimiento: '',
                    edad: '',
                    categoria: '',
                    demarcacion: '',
                    talla: '',
                    lateralidad: '',
                    nombreTutor: '',
                    telefono: '',
                    direccion: '',
                    ciudad: '',
                    codigoPostal: '',
                    alergias: '',
                    informacionInteres: '',
                    autorizacion: false,
                    politicaPrivacidad: false
                });

                // Reset touched fields
                setTouchedFields({});

                // Cerrar el formulario
                onClose();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error al enviar inscripción:', error);
            alert('Error inesperado al enviar la inscripción. Por favor, inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="registration-form-container">
            <form onSubmit={handleSubmit} className="registration-form">
                <h3>Formulario de Inscripción - Campus de Verano 2025</h3>

                <div className="form-section">
                    <h4>Datos del Niño/a</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombreNino">Nombre *</label>
                            <input
                                type="text"
                                id="nombreNino"
                                name="nombreNino"
                                value={formData.nombreNino}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`${touchedFields.nombreNino ? 'touched' : ''} ${isFieldInvalid('nombreNino', formData.nombreNino) ? 'invalid' : ''}`}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="apellidos">Apellidos *</label>
                            <input
                                type="text"
                                id="apellidos"
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`${touchedFields.apellidos ? 'touched' : ''} ${isFieldInvalid('apellidos', formData.apellidos) ? 'invalid' : ''}`}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="fechaNacimiento">Fecha de Nacimiento *</label>
                            <input
                                type="date"
                                id="fechaNacimiento"
                                name="fechaNacimiento"
                                value={formData.fechaNacimiento}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`${touchedFields.fechaNacimiento ? 'touched' : ''} ${isFieldInvalid('fechaNacimiento', formData.fechaNacimiento) ? 'invalid' : ''}`}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edad">Edad *</label>
                            <input
                                type="number"
                                id="edad"
                                name="edad"
                                value={formData.edad}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`${touchedFields.edad ? 'touched' : ''} ${isFieldInvalid('edad', formData.edad) ? 'invalid' : ''}`}
                                min="3"
                                max="17"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="categoria">Categoría *</label>
                            <select
                                id="categoria"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                onFocus={handleFocus}
                                className={`${touchedFields.categoria ? 'touched' : ''} ${isFieldInvalid('categoria', formData.categoria) ? 'invalid' : ''} ${isFieldValid('categoria', formData.categoria) ? 'valid' : ''}`}
                                required
                            >
                                <option value="">Seleccione una categoría</option>
                                <option value="iniciacion">Fútbol 8</option>
                                <option value="competicion">Fútbol 11</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="demarcacion">Demarcación *</label>
                            <select
                                id="demarcacion"
                                name="demarcacion"
                                value={formData.demarcacion}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                onFocus={handleFocus}
                                className={`${touchedFields.demarcacion ? 'touched' : ''} ${isFieldInvalid('demarcacion', formData.demarcacion) ? 'invalid' : ''} ${isFieldValid('demarcacion', formData.demarcacion) ? 'valid' : ''}`}
                                required
                            >
                                <option value="">Seleccione una demarcación</option>
                                <option value="portero">Portero</option>
                                <option value="defensa">Defensa</option>
                                <option value="centrocampista">Centrocampista</option>
                                <option value="delantero">Delantero</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="talla">Talla Ropa Adidas*</label>
                            <select
                                id="talla"
                                name="talla"
                                value={formData.talla}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                onFocus={handleFocus}
                                className={`${touchedFields.talla ? 'touched' : ''} ${isFieldInvalid('talla', formData.talla) ? 'invalid' : ''} ${isFieldValid('talla', formData.talla) ? 'valid' : ''}`}
                                required
                            >
                                <option value="">Seleccione una talla</option>
                                <option value="4-5">4-5</option>
                                <option value="6-7">6-7</option>
                                <option value="8-9">8-9</option>
                                <option value="10-11">10-11</option>
                                <option value="12-13">12-13</option>
                                <option value="14">14</option>
                                <option value="s">S</option>
                                <option value="m">M</option>
                                <option value="l">L</option>
                                <option value="xl">XL</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lateralidad">Lateralidad Dominante*</label>
                            <select
                                id="lateralidad"
                                name="lateralidad"
                                value={formData.lateralidad}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                onFocus={handleFocus}
                                className={`${touchedFields.lateralidad ? 'touched' : ''} ${isFieldInvalid('lateralidad', formData.lateralidad) ? 'invalid' : ''} ${isFieldValid('lateralidad', formData.lateralidad) ? 'valid' : ''}`}
                                required
                            >
                                <option value="">Seleccione una lateralidad</option>
                                <option value="diestro">Diestro</option>
                                <option value="zurdo">Zurdo</option>
                                <option value="ambidiestro">Ambidiestro</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>Datos de los Padres/Tutores</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombreTutor">Nombre del Padre/Madre/Tutor*</label>
                            <input
                                type="text"
                                id="nombreTutor"
                                name="nombreTutor"
                                value={formData.nombreTutor}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`${touchedFields.nombreTutor ? 'touched' : ''} ${isFieldInvalid('nombreTutor', formData.nombreTutor) ? 'invalid' : ''}`}
                                placeholder="Nombre completo del tutor"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono *</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`${touchedFields.telefono ? 'touched' : ''} ${isFieldInvalid('telefono', formData.telefono) ? 'invalid' : ''}`}
                                placeholder="Ej: 600 123 456"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>Dirección</h4>
                    <div className="form-group">
                        <label htmlFor="direccion">Dirección *</label>
                        <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`${touchedFields.direccion ? 'touched' : ''} ${isFieldInvalid('direccion', formData.direccion) ? 'invalid' : ''}`}
                            placeholder="Calle, número, piso, puerta"
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="ciudad">Ciudad *</label>
                            <input
                                type="text"
                                id="ciudad"
                                name="ciudad"
                                value={formData.ciudad}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`${touchedFields.ciudad ? 'touched' : ''} ${isFieldInvalid('ciudad', formData.ciudad) ? 'invalid' : ''}`}
                                placeholder="Ciudad de residencia"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="codigoPostal">Código Postal *</label>
                            <input
                                type="text"
                                id="codigoPostal"
                                name="codigoPostal"
                                value={formData.codigoPostal}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`${touchedFields.codigoPostal ? 'touched' : ''} ${isFieldInvalid('codigoPostal', formData.codigoPostal) ? 'invalid' : ''}`}
                                placeholder="46000"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>Información Adicional</h4>

                    <div className="form-group">
                        <label htmlFor="alergias">Alergias o condiciones médicas</label>
                        <textarea
                            id="alergias"
                            name="alergias"
                            value={formData.alergias}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={touchedFields.alergias ? 'touched' : ''}
                            rows="2"
                            placeholder="Especifica cualquier alergia o condición médica relevante"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="informacionInteres">Información de interés</label>
                        <textarea
                            id="informacionInteres"
                            name="informacionInteres"
                            value={formData.informacionInteres}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={touchedFields.informacionInteres ? 'touched' : ''}
                            rows="2"
                            placeholder="Cualquier información adicional que consideres importante"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="autorizacion"
                                checked={formData.autorizacion}
                                onChange={handleInputChange}
                                required
                            />
                            Autorizo la participación de mi hijo/a en todas las actividades del campus y la toma de fotografías con fines promocionales *
                        </label>
                    </div>

                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="politicaPrivacidad"
                                checked={formData.politicaPrivacidad}
                                onChange={handleInputChange}
                                required
                            />
                            Acepto la política de privacidad y el tratamiento de datos personales *
                        </label>
                    </div>
                </div>

                <div className="form-note">
                    <label>
                        EL PAGO SE EFECTUARA EN LA SIGUIENTE CUENTA BANCARIA:
                        <strong> ES51 3159 0017 7029 6262 3225. </strong>
                        PONER EN CONCEPTO CAMPUS, NOMBRE Y APELLIDO DEL NIÑO.
                    </label>
                    <div className='form-note'>
                        <label>
                            POSIBILIDAD DE PAGO EN MANO.
                        </label>
                    </div>
                </div>
                <div className="form-location">
                    <label>
                        📍Polideportivo Municipal de Meliana.
                    </label>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={isSubmitting}
                    >
                        <i className={isSubmitting ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"}></i>
                        {isSubmitting ? 'Enviando...' : 'Enviar Inscripción'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-cancel"
                        disabled={isSubmitting}
                    >
                        <i className="fas fa-times"></i>
                        Cancelar
                    </button>
                </div>


            </form>
        </div>
    );
};

export default InscriptionForm;
