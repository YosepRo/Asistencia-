import { boot } from 'quasar'
import QCalendar from '@quasar/quasar-ui-qcalendar'

export default boot(({ app }) => {
  app.use(QCalendar)
})
