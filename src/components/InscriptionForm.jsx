import React, { useState, useEffect } from 'react';
import { inscriptionService } from '../firebase/inscriptionService';
import { runFirebaseDebug } from '../utils/firebaseDebug';
import { runCompleteFirestoreDiagnosis } from '../utils/firestoreDiagnosis';

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

    // Debug Firebase al montar el componente
    useEffect(() => {
        console.log('🔍 [InscriptionForm] Componente montado - Ejecutando debug...');
        runFirebaseDebug();
        
        // Ejecutar diagnóstico específico de Firestore para el error 400
        console.log('🔧 [InscriptionForm] Ejecutando diagnóstico de Firestore...');
        runCompleteFirestoreDiagnosis();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouchedFields(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Debug logging
        console.log('🚀 Iniciando envío del formulario...');
        console.log('📄 Datos del formulario:', formData);
        console.log('🔧 Variables de entorno Firebase:', {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Configurado' : '❌ No configurado',
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Configurado' : '❌ No configurado',
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Configurado' : '❌ No configurado'
        });

        try {
            // Validar datos antes de enviar
            console.log('🔍 Validando datos...');
            const validation = inscriptionService.validateInscriptionData(formData);
            console.log('📋 Resultado de validación:', validation);

            if (!validation.isValid) {
                console.error('❌ Validación falló:', validation.message);
                alert(validation.message);
                setIsSubmitting(false);
                return;
            }

            // Enviar datos a Firebase
            console.log('🔥 Enviando a Firebase...');
            const result = await inscriptionService.createInscription(formData);
            console.log('📤 Resultado de Firebase:', result);

            if (result.success) {
                console.log('✅ Inscripción enviada exitosamente:', result.id);
                alert('¡Inscripción enviada correctamente! Nos pondremos en contacto contigo pronto. ID de referencia: ' + result.id);

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
                console.error('❌ Error en Firebase:', result);
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('💥 Error inesperado:', error);
            console.error('📍 Stack trace:', error.stack);
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
                                className={touchedFields.nombreNino ? 'touched' : ''}
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
                                className={touchedFields.apellidos ? 'touched' : ''}
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
                                className={touchedFields.fechaNacimiento ? 'touched' : ''}
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
                                className={touchedFields.edad ? 'touched' : ''}
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
                                className={touchedFields.categoria ? 'touched' : ''}
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
                                className={touchedFields.demarcacion ? 'touched' : ''}
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
                                className={touchedFields.talla ? 'touched' : ''}
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
                                className={touchedFields.lateralidad ? 'touched' : ''}
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
                                className={touchedFields.nombreTutor ? 'touched' : ''}
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
                                className={touchedFields.telefono ? 'touched' : ''}
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
                            className={touchedFields.direccion ? 'touched' : ''}
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
                                className={touchedFields.ciudad ? 'touched' : ''}
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
                                className={touchedFields.codigoPostal ? 'touched' : ''}
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
