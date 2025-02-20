<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Menú Lateral (Drawer) -->
    <q-drawer v-model="drawer" side="left" bordered class="drawer-custom">
      <!-- Aquí pueden ir los elementos del menú lateral -->
      <q-list>
        <q-item clickable>
          <q-item-section>Inicio</q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section>Empleados</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Barra superior -->
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Contenedor de páginas -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false) // Controla la visibilidad del drawer
</script>

<style scoped>
/* Estilos para el Drawer (Menú Lateral) */
.drawer-custom {
  width: 230px;
  background-color: transparent;
  color: rgb(65, 216, 239);
  padding-top: 20px;
  padding-bottom: 20px;
  height: 100%; /* Ajusta el tamaño del drawer */
  border-right: 3px solid red; /* Borde rojo en el lado derecho */
}
</style>
