<template>
  <q-layout view="hHh lpR fFf">
    <div class="main-content">
      <!-- Nueva imagen centrada -->
      <img src="logop.jpg" alt="Imagen Central" class="center-image" />
    </div>

    <!-- Menú Lateral -->
    <q-drawer v-model="drawer" show-if-above side="left" bordered class="drawer-custom">
      <!-- Hora y Fecha -->
      <div class="date-time">
        <div class="date">
          <q-icon name="event" size="lg" class="date-icon" />
          <span>{{ currentDate }}</span>
        </div>
        <div class="time">
          <q-icon name="access_time" size="lg" class="time-icon" />
          <span>{{ currentTime }}</span>
        </div>
      </div>

      <div class="logo-section q-pa-md flex flex-center"></div>
      <q-list class="menu-list">
        <!-- Botón de Inicio que recarga la página -->
        <q-item clickable class="menu-item" @click="reloadPage">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Inicio</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/empleados" clickable class="menu-item">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Empleados</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/reportes" clickable class="menu-item">
          <q-item-section avatar>
            <q-icon name="bar_chart" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Reportes</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Barra Superior -->
    <q-header elevated class="header-custom">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleDrawer" class="menu-button" />
        <q-toolbar-title>Dashboard</q-toolbar-title>
        <div class="user-section">
          <q-avatar icon="account_circle" size="md" />
          <span class="q-ml-sm">Hola, Admin</span>
          <q-btn flat icon="logout" @click="logout" />
          <q-btn flat icon="brightness_6" @click="toggleDarkMode" class="mode-toggle-btn" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Contenido Principal -->
    <q-page-container class="main-content">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      currentDate: new Date().toLocaleDateString(), // Fecha en formato legible
      currentTime: new Date().toLocaleTimeString(), // Hora en formato legible
    }
  },
  mounted() {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString() // Actualiza la hora cada segundo
      this.currentDate = new Date().toLocaleDateString() // Actualiza la fecha cada segundo
    }, 1000)
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    if (savedDarkMode) {
      this.darkMode = true
      this.$q.dark.set(true)
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    logout() {
      // Aquí puedes agregar la lógica para cerrar sesión
      this.$router.push('/registerAS') // Redirige a la página de registro de asistencia
    },
    reloadPage() {
      this.$router.go(0) // Recarga la página actual (similar a un "refresh")
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      this.$q.dark.set(this.darkMode) // Cambia el tema de Quasar
      localStorage.setItem('darkMode', this.darkMode) // Guarda la preferencia en el localStorage
    },
  },
}
</script>

<style scoped>
/* Estilos generales */
.main-content {
  position: relative;
  background-color: #ffffff;
  min-height: 100vh;
  padding: 20px;
}

/* Drawer (Menú Lateral) */
.drawer-custom {
  width: 230px;
  background-color: transparent;
  color: rgb(65, 216, 239);
  padding-top: 20px;
  padding-bottom: 20px;
  height: 100%; /* Asegura que el drawer ocupe toda la altura disponible */
  min-height: 100vh; /* Limita la altura */
  border-right: 3px solid red; /* Borde rojo solo en el lado derecho */
  position: fixed;
  transition: width 0.3s ease;
}

/* Estilos para la fecha y hora */
.date-time {
  background-color: rgba(19, 237, 248, 0.2); /* Fondo oscuro semi-transparente */
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  text-align: center;
}

.date,
.time {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(0, 0, 0);
  font-size: 18px;
  margin: 10px 0;
}

.date-icon,
.time-icon {
  margin-right: 8px;
}

.date span,
.time span {
  font-size: 18px;
  font-weight: bold;
  font-family: 'Arial', sans-serif; /* Estilo de letra elegante */
}

/* Estilos para los items del menú */
.menu-item {
  border-radius: 8px;
  margin: 6px 12px;
  padding: 10px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  color: #000000;
  background-color: #1abc9c;
}

/* Efecto al pasar el mouse */
.menu-item:hover {
  background-color: transparent;
  color: #1abc9c;
}

/* Estilo adicional para íconos */
.menu-item q-icon {
  color: #000000;
}

.menu-item:hover q-icon {
  color: #1abc9c;
}

/* Barra superior */
.header-custom {
  background-color: #34495e;
  color: white;
}

/* Botón de menú */
.menu-button {
  color: white;
}

/* Sección de usuario */
.user-section {
  display: flex;
  align-items: center;
}

.q-avatar {
  background: white;
  color: #34495e;
}

/* Imagen centrada */
.center-image {
  width: 800px;
  height: auto;
  position: absolute;
  top: 100px;
  left: 60%;
  transform: translate(-50%, 0);
}
.mode-toggle-btn {
  color: white;
}

/* Estilo responsivo para el drawer en pantallas pequeñas */
@media (max-width: 600px) {
  .drawer-custom {
    width: 100%; /* El drawer ocupa todo el ancho en pantallas pequeñas */
    max-width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .center-image {
    width: 80%; /* Reduzco el tamaño de la imagen en pantallas pequeñas */
    top: 50px;
  }
}
</style>
