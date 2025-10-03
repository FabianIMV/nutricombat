/**
 * Servicio para operaciones relacionadas con usuarios
 */

// IMPORTANTE: Reemplaza esta URL con la URL de tu proyecto de Supabase
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY'; // Agregar tu anon key aquí

/**
 * Obtiene el user_id basado en el email del usuario
 * @param {string} email - Email del usuario
 * @returns {Promise<string|null>} - user_id o null si hay error
 */
export const getUserIdByEmail = async (email) => {
  if (!email) {
    console.error('❌ Email es requerido');
    return null;
  }

  try {
    console.log('🔍 Buscando user_id para email:', email);

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/get-user-id?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('✅ User ID obtenido:', data.user_id);
      return data.user_id;
    } else {
      console.error('❌ Error obteniendo user_id:', data.error);
      console.error('Detalles:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Error en getUserIdByEmail:', error);
    return null;
  }
};

/**
 * Obtiene el user_id y lo guarda en el contexto de autenticación
 * @param {string} email - Email del usuario
 * @param {Function} setUserIdInSession - Función del contexto para guardar el user_id
 * @returns {Promise<string|null>} - user_id o null si hay error
 */
export const fetchAndSaveUserId = async (email, setUserIdInSession) => {
  const userId = await getUserIdByEmail(email);

  if (userId && setUserIdInSession) {
    await setUserIdInSession(userId);
    console.log('💾 User ID guardado en sesión');
  }

  return userId;
};
