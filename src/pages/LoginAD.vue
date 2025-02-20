<template>
  <q-page class="flex flex-center bg-white">
    <!-- Botón de Volver más grande y notorio -->

    <q-card class="card-container">
      <q-card-section class="q-gutter-md flex full-height">
        <div class="logo-section">
          <img src="/logo.jpg" alt="Logo Empresa" class="company-logo" />
        </div>
        <q-btn
          flat
          dense
          icon="arrow_back"
          label="Volver"
          class="volver-btn"
          @click="volverARegistro"
        />

        <div class="login-section">
          <div class="text-h3 text-bold text-black">Administrador</div>
          <div class="text-subtitle1 text-grey-7 q-mb-lg">Inicia sesión para continuar</div>

          <q-input v-model="email" label="Correo" type="email" dense class="input-style" />
          <q-input
            v-model="password"
            label="Contraseña"
            type="password"
            dense
            class="input-style"
          />

          <q-btn label="Ingresar" color="black" class="login-btn q-mt-lg" @click="login()" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { auth } from 'src/boot/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAuthStore } from 'src/stores/authStore.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const authStore = useAuthStore()
    const router = useRouter()

    const login = async () => {
      if (!email.value || !password.value) {
        return
      }

      try {
        const { user } = await signInWithEmailAndPassword(auth, email.value, password.value)

        authStore.login({
          id: user.uid,
          email: user.email,
          name: user.displayName || null,
        })

        router.push('/dashboardAD') // Redirigir al dashboard
      } catch (error) {
        console.error('Error al iniciar sesión:', error)
      }
    }

    const volverARegistro = () => {
      router.push('/registerAS') // Redirigir a registerAS
    }

    return {
      email,
      password,
      login,
      volverARegistro,
    }
  },
}
</script>

<style scoped>
/* Fondo blanco */
.bg-white {
  background-color: #ffffff;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Botón de Volver Mejorado */
.volver-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #000000; /* Azul llamativo */
  color: white;
  font-size: 18px;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.volver-btn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* Tarjeta con diseño moderno */
.card-container {
  width: 70vw;
  height: 70vh;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

/* Sección del Logo */
.logo-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 20px;
}

/* Logo de la empresa */
.company-logo {
  max-width: 110%;
  height: auto;
  max-height: 90%;
  object-fit: contain;
}

/* Sección del Login */
.login-section {
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Estilos del input */
.input-style {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 12px;
  font-size: 18px;
}

/* Botón de login */
.login-btn {
  font-weight: bold;
  border-radius: 10px;
  padding: 16px;
  font-size: 20px;
  width: 100%;
  max-width: 400px;
  background-color: #78d9fc;
  color: #fff;
  transition: 0.3s;
}

.login-btn:hover {
  background-color: #58b0d6;
}

/* Media Queries para pantallas pequeñas (móviles) */
@media (max-width: 768px) {
  .card-container {
    width: 90%;
    height: auto;
  }

  .company-logo {
    max-width: 80%;
    height: auto;
  }

  .login-section {
    padding: 20px;
  }

  .input-style {
    font-size: 16px;
  }

  .login-btn {
    font-size: 18px;
    padding: 12px;
  }

  .volver-btn {
    top: 10px;
    left: 10px;
    font-size: 16px;
    padding: 8px 16px;
  }
}
</style>
