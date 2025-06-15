
# 🔐 GUÍA RÁPIDA - Credenciales y Acceso

## ⚡ Acceso Inmediato

### 1. Ir a la página de login: `/login`

### 2. Hacer clic en "Crear usuarios demo" (botón verde)
**¡IMPORTANTE!** Esto debe hacerse ANTES de intentar hacer login

### 3. Usar cualquiera de estas credenciales (NOMBRE o EMAIL):

| Rol | **NOMBRE** | Email | Contraseña |
|---------|--------|--------|------------|
| **Desarrollador** | `Desarrollador` | `dev@micampana.com` | `micampana2025` |
| **Master** | `Master` | `master1@demo.com` | `micampana2025` |
| **Candidato** | `Candidato` | `candidato@demo.com` | `micampana2025` |
| **Líder** | `Lider` | `lider@demo.com` | `micampana2025` |
| **Votante** | `Votante` | `votante@demo.com` | `micampana2025` |

## 🎯 LOGIN SIMPLIFICADO

**Ahora puedes usar solo el NOMBRE:**
- Usuario: `Desarrollador`
- Contraseña: `micampana2025`

**O el email tradicional:**
- Email: `dev@micampana.com`
- Contraseña: `micampana2025`

## 🚨 Si NO Funciona el Login:

1. **Verificar que se crearon los usuarios:**
   - Buscar mensaje "Usuarios creados exitosamente"
   - Si no aparece, volver a hacer clic en "Crear usuarios demo"

2. **Usar credenciales exactas:**
   - Nombre: `Desarrollador` (CON mayúscula inicial)
   - Contraseña: `micampana2025` (SIN ñ)

3. **Revisar consola del navegador:**
   - F12 → Console
   - Buscar errores rojos
   - Copiar el mensaje de error

## 🔄 Proceso de Login Actualizado

```javascript
// Ahora el sistema:
1. Detecta si es nombre o email (por presencia de @)
2. Si es nombre, busca el email correspondiente
3. Realiza login con el email encontrado
4. Muestra confirmación al completar
```

## ✅ Verificación Rápida

**Después de crear usuarios, probar login con:**
- `Desarrollador` / `micampana2025`
- O `Master` / `micampana2025`

## 🎯 Usuario Recomendado para Pruebas

**Usar:** `Desarrollador` / `micampana2025`
- Tiene todos los permisos
- Puede ver todo el sistema
- Ideal para pruebas completas

## 💡 Ventajas del Login por Nombre

- **Sin caracteres especiales** (evita problemas con ñ, acentos)
- **Más fácil de recordar** que emails largos
- **Compatible con ambos** (nombre y email funcionan)
