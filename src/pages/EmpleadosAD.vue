<template>
  <q-page class="q-pa-md">
    <!-- Botón para regresar -->
    <q-btn flat icon="arrow_back" color="primary" @click="goBack" class="q-mb-md q-mb-xs-none" />

    <!-- Buscador para filtrar empleados por nombre -->
    <q-input
      v-model="filter"
      label="Buscar por Nombre"
      debounce="300"
      class="q-mb-md q-mb-xs-none"
      outlined
      dense
      :clearable="true"
    />

    <!-- Botón para agregar un nuevo empleado -->
    <q-btn
      label="Agregar Empleado"
      color="primary"
      class="q-mb-md q-mb-xs-none q-px-lg"
      style="font-size: 16px; font-weight: 600"
      @click="openAddEmployeeDialog"
    />

    <!-- Lista de empleados -->
    <q-card class="q-pa-md" bordered>
      <q-card-section>
        <div class="text-h6 text-primary">Lista de Empleados</div>
      </q-card-section>
      <q-table
        :rows="filteredEmployees"
        :columns="columns"
        row-key="dni"
        :filter="filter"
        :rows-per-page-options="[5, 10, 15]"
        class="q-mb-md"
        :dense="false"
        :pagination="pagination"
        style="border-radius: 10px"
      >
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              flat
              icon="edit"
              color="primary"
              @click="editEmployee(props.row)"
              class="q-mr-sm"
            />
            <q-btn
              flat
              icon="delete"
              color="negative"
              @click="deleteEmployee(props.row)"
              class="q-mr-sm"
            />
            <q-btn flat icon="access_time" color="secondary" @click="viewAttendance(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Ventana emergente para agregar o editar un empleado -->
    <q-dialog v-model="addEmployeeDialog">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Agregar/Editar Empleado</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="employeeForm.dni"
            label="DNI"
            :disabled="isEditing"
            filled
            class="q-mb-sm"
          />
          <q-input v-model="employeeForm.nombre" label="Nombres" filled class="q-mb-sm" />
          <q-input v-model="employeeForm.apellido" label="Apellidos" filled class="q-mb-sm" />
          <q-input v-model="employeeForm.rol" label="Rol" filled class="q-mb-sm" />
          <q-input v-model="employeeForm.telefono" label="Teléfono" filled class="q-mb-sm" />
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="Cancelar" color="negative" @click="closeAddEmployeeDialog" />
          <q-btn flat label="Guardar" color="primary" @click="saveEmployee" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de confirmación para eliminar empleado -->
    <q-dialog v-model="confirmDeleteDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar Eliminación</div>
        </q-card-section>

        <q-card-section> ¿Estás seguro de que deseas eliminar a este empleado? </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="cancelDelete" />
          <q-btn flat label="Sí" color="negative" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { getDocs, collection, setDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from 'src/boot/firebase'

export default {
  data() {
    return {
      employees: [],
      columns: [
        { name: 'dni', label: 'DNI', align: 'left', field: 'dni' },
        { name: 'nombre', label: 'Nombres', align: 'left', field: 'nombre' },
        { name: 'apellido', label: 'Apellidos', align: 'left', field: 'apellido' },
        { name: 'rol', label: 'Rol', align: 'left', field: 'rol' },
        { name: 'telefono', label: 'Teléfono', align: 'left', field: 'telefono' },
        { name: 'action', label: 'Acciones', align: 'center' },
      ],
      filter: '',
      pagination: {
        page: 1,
        rowsPerPage: 5,
      },
      addEmployeeDialog: false,
      isEditing: false,
      employeeForm: {
        dni: '',
        nombre: '',
        apellido: '',
        rol: '',
        telefono: '',
      },
      confirmDeleteDialog: false,
      employeeToDelete: null,
    }
  },
  computed: {
    filteredEmployees() {
      return this.employees.filter((employee) =>
        employee.nombre.toLowerCase().includes(this.filter.toLowerCase()),
      )
    },
  },
  methods: {
    goBack() {
      this.$router.push('/dashboardAD')
    },
    viewAttendance(employee) {
      this.$router.push({ path: `/calendario/${employee.dni}` })
    },
    openAddEmployeeDialog() {
      this.isEditing = false
      this.employeeForm = { dni: '', nombre: '', apellido: '', rol: '', telefono: '' }
      this.addEmployeeDialog = true
    },
    closeAddEmployeeDialog() {
      this.addEmployeeDialog = false
    },
    async saveEmployee() {
      if (this.isEditing) {
        const employeeRef = doc(db, 'employees', this.employeeForm.dni)
        await setDoc(employeeRef, this.employeeForm)
      } else {
        const employeeRef = doc(db, 'employees', this.employeeForm.dni)
        await setDoc(employeeRef, this.employeeForm)
      }
      this.closeAddEmployeeDialog()
      this.fetchEmployees()
    },

    editEmployee(employee) {
      this.isEditing = true
      this.employeeForm = { ...employee }
      this.addEmployeeDialog = true
    },
    deleteEmployee(employee) {
      this.employeeToDelete = employee
      this.confirmDeleteDialog = true
    },
    async confirmDelete() {
      if (this.employeeToDelete) {
        try {
          const employeeRef = doc(db, 'employees', this.employeeToDelete.dni)
          await deleteDoc(employeeRef)
          this.fetchEmployees()
        } catch (error) {
          console.error('Error eliminando empleado:', error)
        } finally {
          this.confirmDeleteDialog = false
          this.employeeToDelete = null
        }
      }
    },
    cancelDelete() {
      this.confirmDeleteDialog = false
      this.employeeToDelete = null
    },
    async fetchEmployees() {
      const querySnapshot = await getDocs(collection(db, 'employees'))
      this.employees = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        dni: doc.id,
      }))
    },
  },
  mounted() {
    this.fetchEmployees()
  },
}
</script>

<style scoped>
.q-page {
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
}

.q-card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.q-btn {
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 5px;
}

.q-btn.q-mb-md {
  font-size: 16px;
}

.q-table {
  border-radius: 10px;
}

.q-table .q-th {
  background-color: #f4f5f7;
  font-weight: bold;
}

.q-table .q-td {
  border-top: 1px solid #e0e0e0;
}

.q-card-actions {
  display: flex;
  justify-content: flex-end;
}

.q-card-section {
  padding: 20px;
}

.text-primary {
  color: #1976d2;
}

@media (max-width: 600px) {
  .q-table {
    font-size: 12px;
  }

  .q-btn {
    font-size: 14px;
  }

  .q-input {
    font-size: 14px;
  }

  .q-card {
    padding: 10px;
  }
}
</style>
