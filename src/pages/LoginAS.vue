<template>
  <q-page class="welcome-page flex flex-center">
    <q-card class="welcome-card">
      <q-card-section class="text-center">
        <q-img src="/logop.jpg" class="logo" />
        <div class="welcome-title">BIENVENIDO A RECREO MÁNKORA</div>
        <div class="welcome-subtitle">Sistema de Registro de Trabajadores</div>
      </q-card-section>

      <q-card-section class="text-center">
        <q-btn
          label="Marcar Asistencia"
          color="primary"
          class="full-width q-py-md btn-large"
          @click="goToRegisterAS"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  methods: {
    goToRegisterAS() {
      this.$router.push('/registerAS')
    },
  },
}
</script>

<style scoped>
/* Fondo adaptable a pantallas */
.welcome-page {
  background: url('/img/background.jpg') no-repeat center center;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* Tarjeta más grande y con borde celeste */
.welcome-card {
  width: 90%;
  max-width: 600px; /* Ajuste en PC */
  min-height: 450px; /* Ajuste en PC */
  padding: 30px;
  border-radius: 18px;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
  border: 5px solid #00bfff;
}

/* Logo adaptable */
.logo {
  max-width: 180px;
  margin-bottom: 20px;
}

/* Texto que se ajusta en móviles */
.welcome-title {
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
}

/* Subtítulo más pequeño en móviles */
.welcome-subtitle {
  font-size: 1.2rem;
  color: #555;
  margin-top: 8px;
}

/* Botón grande en PC pero ajustable en móviles */
.btn-large {
  font-weight: bold;
  border-radius: 12px;
  padding: 14px;
  font-size: 18px;
}

/* Ajustes para móviles */
@media (max-width: 600px) {
  .welcome-card {
    max-width: 90%;
    min-height: auto;
    padding: 20px;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .btn-large {
    font-size: 16px;
    padding: 12px;
  }
}
</style>
