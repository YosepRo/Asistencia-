<template>
  <q-page class="flex flex-center bg-white">
    <q-card class="card-container">
      <q-card-section class="q-gutter-md flex full-height">
        <div class="logo-section">
          <img src="/logo.jpg" alt="Logo Empresa" class="company-logo" />
        </div>

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

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        this.$q.notify({
          color: 'negative',
          message: 'Por favor, complete todos los campos.',
          icon: 'error',
        })
        return
      }

      try {
        await signInWithEmailAndPassword(auth, this.email, this.password)
        this.$q.notify({
          color: 'positive',
          message: 'Inicio de sesión exitoso',
          icon: 'check_circle',
        })

        this.$router.push('/dashboardAD') // Redirigir al dashboard
      } catch (error) {
        this.$q.notify({
          color: 'negative',
          message: 'Error: ' + error.message,
          icon: 'error',
        })
      }
    },
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

/* Tarjeta con diseño moderno */
.card-container {
  width: 70vw; /* Se ajusta para que sea más grande */
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
  background-color: #78d9fc;
}

/* Media Queries para pantallas pequeñas (móviles) */
@media (max-width: 768px) {
  /* Ajuste del tamaño de la tarjeta */
  .card-container {
    width: 90%; /* Se ajusta el ancho para pantallas pequeñas */
    height: auto;
  }

  /* Ajuste del tamaño del logo */
  .company-logo {
    max-width: 80%;
    height: auto;
  }

  /* Sección de login: Reducir los márgenes y el relleno */
  .login-section {
    padding: 20px;
  }

  /* Ajuste de los inputs y botones */
  .input-style {
    font-size: 16px; /* Hacer los inputs más pequeños */
  }

  .login-btn {
    font-size: 18px; /* Botón más pequeño en pantallas pequeñas */
    padding: 12px;
  }
}
</style>
