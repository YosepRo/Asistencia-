<template>
  <q-page class="q-pa-md">
    <q-btn flat icon="arrow_back" color="primary" @click="goBack" class="q-mb-md q-mb-xs-none" />
    <div class="row q-col-gutter-md">
      <!-- Reporte por Rango de Fechas -->
      <q-card class="col-12 col-md-6 q-pa-md">
        <q-card-section>
          <div class="text-h5 text-bold">Reporte por Rango de Fechas</div>
        </q-card-section>

        <q-card-section class="row q-col-gutter-md">
          <q-input v-model="startDate" filled label="Fecha de inicio" type="date" class="col-6" />
          <q-input v-model="endDate" filled label="Fecha de fin" type="date" class="col-6" />
          <q-btn
            label="Generar Reporte"
            color="primary"
            icon="search"
            @click="fetchReportByRange"
            class="full-width q-mt-md"
          />
        </q-card-section>
      </q-card>

      <!-- Reporte por Día -->
      <q-card class="col-12 col-md-6 q-pa-md">
        <q-card-section>
          <div class="text-h5 text-bold">Reporte por Día</div>
        </q-card-section>

        <q-card-section class="row q-col-gutter-md">
          <q-input
            v-model="singleDate"
            filled
            label="Selecciona una fecha"
            type="date"
            class="col-6"
          />
          <q-btn
            label="Generar Reporte"
            color="secondary"
            icon="event"
            @click="fetchReportByDay"
            class="full-width q-mt-md"
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- Tabla de Resultados -->
    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Resultados</div>
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="attendanceRecords"
          :columns="columns"
          row-key="dni"
          v-if="attendanceRecords.length"
        />
        <div v-else class="text-center text-grey q-mt-md">
          No hay registros para el día seleccionado.
        </div>
      </q-card-section>

      <!-- Botón para generar PDF -->
      <q-card-section v-if="attendanceRecords.length">
        <q-btn
          label="Generar PDF"
          color="red"
          icon="picture_as_pdf"
          @click="generatePDF"
          class="full-width q-mt-md"
        />
      </q-card-section>
    </q-card>

    <!-- Botón para volver al Dashboard -->
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from 'src/boot/firebase.js'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const startDate = ref('')
    const endDate = ref('')
    const singleDate = ref('')
    const attendanceRecords = ref([])
    const columns = ref([]) // Columnas dinámicas
    const goBack = () => {
      router.push('/dashboardAD') // Redirige a la página anterior
    }

    const calcularMinutosTarde = (horaEntrada) => {
      if (!horaEntrada) return 0

      const [hora, minuto] = horaEntrada.split(':').map(Number)
      const entradaPermitida = 8 * 60 + 5 // 08:05 AM en minutos
      const entradaEmpleado = hora * 60 + minuto

      return entradaEmpleado > entradaPermitida ? entradaEmpleado - entradaPermitida : 0
    }

    // Obtener reporte por rango de fechas
    const fetchReportByRange = async () => {
      if (!startDate.value || !endDate.value) {
        alert('Por favor, selecciona ambas fechas')
        return
      }

      const attendanceRef = collection(db, 'asistencias')
      const q = query(
        attendanceRef,
        where('fecha', '>=', startDate.value),
        where('fecha', '<=', endDate.value),
      )

      const querySnapshot = await getDocs(q)
      const recordsMap = new Map()

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const minutosTarde = calcularMinutosTarde(data.horaEntrada)

        if (!recordsMap.has(data.dni)) {
          recordsMap.set(data.dni, {
            dni: data.dni,
            nombre: data.nombre,
            minutosTarde: 0,
            fechas: {},
          })
        }

        const record = recordsMap.get(data.dni)
        record.fechas[data.fecha] = data.horaEntrada
        record.minutosTarde += minutosTarde
      })

      // Convertir el mapa a un array de registros
      attendanceRecords.value = Array.from(recordsMap.values()).map((record) => ({
        dni: record.dni,
        nombre: record.nombre,
        ...record.fechas,
        minutosTarde: `${record.minutosTarde} minutos tarde`,
      }))

      // Configurar las columnas dinámicas
      const fechasUnicas = [...new Set(querySnapshot.docs.map((doc) => doc.data().fecha))]
      columns.value = [
        { name: 'dni', label: 'DNI', align: 'left', field: 'dni' },
        { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre' },
        ...fechasUnicas.map((fecha) => ({
          name: fecha,
          label: fecha,
          align: 'left',
          field: fecha,
        })),
        { name: 'minutosTarde', label: 'Tarde', align: 'left', field: 'minutosTarde' },
      ]
    }

    // Obtener reporte por un solo día
    const fetchReportByDay = async () => {
      if (!singleDate.value) {
        alert('Por favor, selecciona una fecha')
        return
      }

      const attendanceRef = collection(db, 'asistencias')
      const q = query(attendanceRef, where('fecha', '==', singleDate.value))

      const querySnapshot = await getDocs(q)
      attendanceRecords.value = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        const minutosTarde = calcularMinutosTarde(data.horaEntrada)

        return {
          dni: data.dni,
          nombre: data.nombre,
          horaEntrada: data.horaEntrada,
          minutosTarde: `${minutosTarde} minutos tarde`,
        }
      })

      // Configurar las columnas fijas para un solo día
      columns.value = [
        { name: 'dni', label: 'DNI', align: 'left', field: 'dni' },
        { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre' },
        { name: 'horaEntrada', label: 'Hora Entrada', align: 'left', field: 'horaEntrada' },
        { name: 'minutosTarde', label: 'Minutos Tarde', align: 'left', field: 'minutosTarde' },
      ]
    }

    // Generar PDF
    const generatePDF = () => {
      if (attendanceRecords.value.length === 0) {
        alert('No hay datos para generar el PDF')
        return
      }

      const doc = new jsPDF()
      doc.text('Reporte de Asistencias', 14, 10)

      const tableColumn = columns.value.map((col) => col.label)
      const tableRows = attendanceRecords.value.map((item) =>
        columns.value.map((col) => item[col.field]),
      )

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      })

      doc.save('Reporte_Asistencias.pdf')

      // Limpiar los resultados después de generar el PDF
      attendanceRecords.value = []
    }

    return {
      startDate,
      endDate,
      singleDate,
      fetchReportByRange,
      fetchReportByDay,
      attendanceRecords,
      columns,
      generatePDF,
      goBack,
    }
  },
}
</script>
<style scoped>
.q-card {
  max-width: 800px;
  margin: auto;
}
</style>
