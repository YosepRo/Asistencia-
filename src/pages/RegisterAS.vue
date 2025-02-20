<template>
  <q-page class="flex flex-center bg-light">
    <q-card class="card-container shadow-2 rounded-borders">
      <q-card-section class="text-center">
        <div class="text-h4 text-bold text-primary">Bienvenido</div>
        <div class="text-h6 text-dark">Registre su asistencia</div>
      </q-card-section>

      <q-card-section class="text-center">
        <div class="text-h3 text-cyan time-container">{{ currentTime }}</div>
        <div class="text-h5 text-dark date-container">{{ currentDate }}</div>

        <q-input
          v-model="dni"
          label="Ingrese su DNI"
          type="text"
          maxlength="8"
          class="input-style"
          dense
          outlined
        />

        <q-btn
          label="Registrar Asistencia"
          color="secondary"
          class="register-btn q-mt-md"
          @click="registerAttendance"
          :disable="loading"
          icon="check_circle"
        />
      </q-card-section>

      <q-card-section class="text-center">
        <q-btn
          flat
          dense
          class="admin-link"
          @click="goToAdmin"
          label="Administrador"
          icon="admin_panel_settings"
          color="primary"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { collection, getDocs, addDoc, query, where, updateDoc, doc } from 'firebase/firestore'
import { db } from 'src/boot/firebase.js'

export default {
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const dni = ref('')
    const currentDate = ref('')
    const currentTime = ref('')
    const loading = ref(false)

    const updateDateTime = () => {
      const now = new Date()
      currentDate.value = now.toLocaleDateString('es-ES')
      currentTime.value = now.toLocaleTimeString('es-ES', { hour12: false })
    }

    onMounted(() => {
      setInterval(updateDateTime, 1000)
    })

    const registerAttendance = async () => {
      if (!dni.value || dni.value.trim().length !== 8) {
        $q.notify({
          type: 'negative',
          message: 'Por favor, ingrese un DNI válido.',
          icon: 'error',
        })
        return
      }

      loading.value = true

      try {
        const employeesRef = collection(db, 'employees')
        const q = query(employeesRef, where('dni', '==', dni.value))

        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          $q.notify({
            type: 'negative',
            message: 'El DNI no está registrado en el sistema.',
            icon: 'error',
          })
          return
        }

        const employeeData = querySnapshot.docs[0].data()

        const now = new Date()
        const todayDate =
          now.getFullYear() +
          '-' +
          String(now.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(now.getDate()).padStart(2, '0') // Formato YYYY-MM-DD
        const attendanceRef = collection(db, 'asistencias')

        // Buscar si ya tiene asistencia registrada hoy
        const attendanceQuery = query(
          attendanceRef,
          where('dni', '==', dni.value),
          where('fecha', '==', todayDate),
        )
        const attendanceSnapshot = await getDocs(attendanceQuery)

        if (!attendanceSnapshot.empty) {
          // Si ya tiene una entrada, registrar salida
          const attendanceDoc = attendanceSnapshot.docs[0]
          await updateDoc(doc(db, 'asistencias', attendanceDoc.id), {
            horaSalida: currentTime.value,
          })

          $q.notify({
            type: 'positive',
            message: `Salida registrada para ${employeeData.nombre}.`,
            icon: 'check_circle',
          })
          dni.value = ''
          return
        }

        // Definir hora de entrada estándar (ejemplo: 08:00 AM)
        const horaEntradaEsperada = '08:00:00'
        const llegoTarde = currentTime.value > horaEntradaEsperada

        // Registrar nueva asistencia
        await addDoc(attendanceRef, {
          dni: dni.value,
          nombre: employeeData.nombre,
          fecha: todayDate,
          horaEntrada: currentTime.value,
          horaSalida: null,
          tarde: llegoTarde,
        })

        $q.notify({
          type: 'positive',
          message: `Asistencia registrada para ${employeeData.nombre}.`,
          icon: 'check_circle',
        })

        dni.value = ''
      } catch (error) {
        console.error('Error registrando asistencia:', error)
        $q.notify({
          type: 'negative',
          message: 'Ocurrió un error al registrar la asistencia.',
          icon: 'error',
        })
      } finally {
        loading.value = false
      }
    }

    const goToAdmin = () => {
      router.push('/loginad')
    }

    return { dni, currentDate, currentTime, loading, registerAttendance, goToAdmin }
  },
}
</script>

<style scoped>
.bg-light {
  background-color: #f4f5f7;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-container {
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
}

.time-container {
  font-size: 48px;
  font-weight: bold;
  color: #00bcd4;
  margin-bottom: 10px;
}

.date-container {
  font-size: 22px;
  color: #333333;
  margin-bottom: 20px;
}

.input-style {
  border-radius: 10px;
  background-color: #f0f4f8;
  color: #333;
  border: 1px solid #ccc;
  padding: 10px;
}

.register-btn {
  font-weight: bold;
  border-radius: 10px;
  padding: 12px;
  font-size: 16px;
  width: 100%;
  transition: 0.3s;
}

.register-btn:hover {
  background-color: #00796b;
}

.admin-link {
  font-size: 18px;
  font-weight: bold;
  color: #00796b;
  cursor: pointer;
  transition: 0.3s;
}

.admin-link:hover {
  color: #005b4f;
}

@media (max-width: 600px) {
  .card-container {
    width: 90%;
  }
}
</style>
