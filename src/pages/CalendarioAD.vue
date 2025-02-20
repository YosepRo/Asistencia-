<template>
  <q-page class="q-pa-md">
    <q-btn flat icon="arrow_back" color="primary" @click="goBack" class="q-mb-md" />
    <div class="text-h5 text-primary q-mb-md text-center">Asistencia de {{ employeeName }}</div>

    <div class="calendario">
      <div class="header">
        <q-btn flat dense icon="chevron_left" color="primary" @click="prevMonth" />
        <span class="mes-actual">{{ mesActual }} {{ añoActual }}</span>
        <q-btn flat dense icon="chevron_right" color="primary" @click="nextMonth" />
      </div>
      <div class="dias-semana">
        <div v-for="dia in diasSemana" :key="dia" class="dia-semana">{{ dia }}</div>
      </div>
      <div class="dias-mes">
        <div
          v-for="(dia, index) in dias"
          :key="index"
          :class="getClaseDia(dia)"
          @click="seleccionarDia(dia)"
        >
          {{ dia ? dia.getDate() : '' }}
        </div>
      </div>
    </div>

    <div v-if="diaSeleccionado" class="detalle-dia q-mt-md text-center">
      <div class="text-h6">Detalles del día seleccionado:</div>
      <p>Fecha: {{ diaSeleccionado.toLocaleDateString() }}</p>
      <p v-if="asistencias[diaSeleccionado.toISOString().split('T')[0]]">
        Hora de entrada: {{ asistencias[diaSeleccionado.toISOString().split('T')[0]].horaEntrada }}
        <span v-if="asistencias[diaSeleccionado.toISOString().split('T')[0]].minutosTarde > 0">
          ({{ asistencias[diaSeleccionado.toISOString().split('T')[0]].minutosTarde }} minutos
          tarde)
        </span>
      </p>
      <p v-else>No hay registro de asistencia para este día.</p>
    </div>

    <div class="total-tarde text-center q-mt-md">
      Total minutos tarde este mes: <strong>{{ totalMinutesLate }}</strong>
    </div>
  </q-page>
</template>
<script>
import { ref, onMounted, computed } from 'vue' // Añade computed aquí
import { useRoute, useRouter } from 'vue-router'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from 'src/boot/firebase'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const employeeName = ref('')
    const totalMinutesLate = ref(0)
    const fechaActual = ref(new Date())
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    const asistencias = ref({})
    const diaSeleccionado = ref(null)

    // Usa computed para mesActual y añoActual
    const mesActual = computed(() => {
      return fechaActual.value.toLocaleString('default', { month: 'long' })
    })

    const añoActual = computed(() => {
      return fechaActual.value.getFullYear()
    })

    const dias = computed(() => {
      const primerDiaMes = new Date(
        fechaActual.value.getFullYear(),
        fechaActual.value.getMonth(),
        1,
      )
      const ultimoDiaMes = new Date(
        fechaActual.value.getFullYear(),
        fechaActual.value.getMonth() + 1,
        0,
      )
      const dias = []

      // Rellenar con días vacíos hasta el primer día del mes
      for (let i = 0; i < primerDiaMes.getDay(); i++) {
        dias.push(null)
      }

      // Rellenar con los días del mes
      for (let i = 1; i <= ultimoDiaMes.getDate(); i++) {
        dias.push(new Date(fechaActual.value.getFullYear(), fechaActual.value.getMonth(), i))
      }

      return dias
    })

    const getClaseDia = (dia) => {
      if (!dia) return 'dia-vacio'

      const fechaISO = dia.toISOString().split('T')[0]
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0) // Asegurar que solo comparamos fechas sin horas

      if (dia > hoy) {
        return 'dia-futuro' // No pintar los días futuros
      }

      if (asistencias.value[fechaISO]) {
        return asistencias.value[fechaISO].minutosTarde > 0 ? 'dia-tarde' : 'dia-asistio'
      } else if (dia.getDay() === 1) {
        return 'dia-lunes'
      } else {
        return 'dia-falto'
      }
    }

    const seleccionarDia = (dia) => {
      if (dia) {
        diaSeleccionado.value = dia
      }
    }

    const prevMonth = () => {
      fechaActual.value = new Date(
        fechaActual.value.getFullYear(),
        fechaActual.value.getMonth() - 1,
        1,
      )
    }

    const nextMonth = () => {
      fechaActual.value = new Date(
        fechaActual.value.getFullYear(),
        fechaActual.value.getMonth() + 1,
        1,
      )
    }

    const calculateMinutesLate = (horaEntrada) => {
      const entradaEsperada = '08:05:00'
      const [hora, minuto] = horaEntrada.split(':')
      const [horaEsperada, minutoEsperado] = entradaEsperada.split(':')
      const diff = (hora - horaEsperada) * 60 + (minuto - minutoEsperado)
      return diff > 0 ? diff : 0
    }

    const isMonday = (date) => new Date(date).getDay() === 1

    const fetchEmployeeAttendance = async () => {
      const dni = route.params.dni
      const attendanceRef = collection(db, 'asistencias')
      const q = query(attendanceRef, where('dni', '==', dni))
      const querySnapshot = await getDocs(q)

      let total = 0
      let events = {}

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const date = new Date(data.fecha)
        if (!isMonday(date)) {
          const minutosTarde = data.tarde ? calculateMinutesLate(data.horaEntrada) : 0
          total += minutosTarde
          events[date.toISOString().split('T')[0]] = {
            horaEntrada: data.horaEntrada,
            minutosTarde,
          }
        }
      })

      asistencias.value = events
      totalMinutesLate.value = total

      const employeesRef = collection(db, 'employees')
      const employeeQuery = query(employeesRef, where('dni', '==', dni))
      const employeeSnapshot = await getDocs(employeeQuery)
      if (!employeeSnapshot.empty) {
        employeeName.value = employeeSnapshot.docs[0].data().nombre
      }
    }

    const goBack = () => {
      router.go(-1)
    }

    onMounted(fetchEmployeeAttendance)

    return {
      employeeName,
      totalMinutesLate,
      fechaActual,
      diasSemana,
      asistencias,
      diaSeleccionado,
      mesActual,
      añoActual,
      dias,
      getClaseDia,
      seleccionarDia,
      prevMonth,
      nextMonth,
      goBack,
    }
  },
}
</script>

<style scoped>
.calendario {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  max-width: 380px;
  margin: auto;
  transition: all 0.3s ease-in-out;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 0;
  font-size: 1.2em;
  font-weight: bold;
}

.mes-actual {
  font-size: 1.3em;
  font-weight: bold;
  color: #007bff;
}

.dias-semana,
.dias-mes {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  width: 100%;
}

.dia-semana {
  font-weight: bold;
  background: #f1f3f4;
  padding: 10px;
  border-radius: 6px;
  color: #333;
  text-transform: uppercase;
  font-size: 0.9em;
}

.dias-mes div {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-size: 1em;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  user-select: none;
}

.dias-mes div:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Colores más vibrantes */
.dia-asistio {
  background: #4caf50;
  color: #fff;
  font-weight: bold;
}

.dia-tarde {
  background: #ff9800;
  color: #fff;
  font-weight: bold;
}

.dia-falto {
  background: #f44336;
  color: #fff;
  font-weight: bold;
}

.dia-lunes {
  background: #9e9e9e;
  color: #fff;
}

.detalle-dia {
  background: #ffffff;
  padding: 14px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 380px;
  margin: auto;
  transition: all 0.3s ease-in-out;
}

.total-tarde {
  font-size: 1.2em;
  background: #ffeb3b;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  max-width: 380px;
  margin: auto;
  font-weight: bold;
}

.dia-futuro {
  background: #ffffff; /* Mantenerlo blanco */
  color: #000000; /* Color de texto normal */
}
</style>
