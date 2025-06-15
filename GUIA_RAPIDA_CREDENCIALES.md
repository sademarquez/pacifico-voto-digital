
# 🔐 GUÍA RÁPIDA - Credenciales y Acceso

## ⚡ Acceso Inmediato

### 1. Ir a la página de login: `/login`

### 2. Hacer clic en "Crear usuarios demo" (botón verde)
**¡IMPORTANTE!** Esto debe hacerse ANTES de intentar hacer login

### 3. Usar cualquiera de estas credenciales:

| Usuario | Email | Contraseña |
|---------|--------|------------|
| **Desarrollador** | `dev@micampana.com` | `micampana2025` |
| **Master** | `master1@demo.com` | `micampana2025` |
| **Candidato** | `candidato@demo.com` | `micampana2025` |
| **Líder** | `lider@demo.com` | `micampana2025` |
| **Votante** | `votante@demo.com` | `micampana2025` |

## 🚨 Si NO Funciona el Login:

1. **Verificar que se crearon los usuarios:**
   - Buscar mensaje "Usuarios creados exitosamente"
   - Si no aparece, volver a hacer clic en "Crear usuarios demo"

2. **Verificar credenciales exactas:**
   - Email: `dev@micampana.com` (CON .com, NO .co)
   - Contraseña: `micampana2025` (SIN ñ)

3. **Revisar consola del navegador:**
   - F12 → Console
   - Buscar errores rojos
   - Copiar el mensaje de error

## 🔄 Proceso de Creación (Técnico)

```javascript
// Lo que hace el botón "Crear usuarios demo":
1. supabase.auth.signUp() // Crea en auth.users
2. Actualiza tabla profiles con rol correcto
3. Pausa 2 segundos entre usuarios (evita rate limiting)
4. Muestra confirmación al completar
```

## ✅ Verificación Rápida

**Después de crear usuarios, verificar en Supabase:**
- Auth → Users → Debe mostrar 5 usuarios
- Database → profiles → Debe mostrar 5 perfiles con roles

## 🎯 Usuario Recomendado para Pruebas

**Usar:** `dev@micampana.com` / `micampana2025`
- Tiene todos los permisos
- Puede ver todo el sistema
- Ideal para pruebas completas
