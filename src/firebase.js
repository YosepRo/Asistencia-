// src/firebase.js
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from 'src/boot/firebase' // Asegúrate de importar Firestore desde firebase.js

// Función para agregar un nuevo empleado a Firestore
const addEmployeeToFirestore = async (employeeData) => {
  try {
    const docRef = await addDoc(collection(db, 'employees'), employeeData)
    console.log('Empleado agregado con ID:', docRef.id)
  } catch (e) {
    console.error('Error agregando el empleado: ', e)
  }
}

// Función para actualizar un empleado en Firestore
const updateEmployeeInFirestore = async (dni, employeeData) => {
  try {
    const docRef = doc(db, 'employees', dni) // Usa el DNI como ID del documento
    await updateDoc(docRef, employeeData)
    console.log('Empleado actualizado con ID:', dni)
  } catch (e) {
    console.error('Error actualizando el empleado: ', e)
  }
}

// Función para eliminar un empleado de Firestore
const deleteEmployeeFromFirestore = async (dni) => {
  try {
    const docRef = doc(db, 'employees', dni) // Usa el DNI como ID del documento
    await deleteDoc(docRef)
    console.log('Empleado eliminado con DNI:', dni)
  } catch (e) {
    console.error('Error eliminando el empleado: ', e)
  }
}

export { addEmployeeToFirestore, updateEmployeeInFirestore, deleteEmployeeFromFirestore }
