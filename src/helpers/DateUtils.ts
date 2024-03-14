const getStartMonth = (value: Date) => {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0)
}

const getStartNextMonth = (value: Date) => {
  return new Date(value.getFullYear(), value.getMonth() + 1, value.getDate(), 0, 0, 0, 0)
}

function formatDate(date?: Date) {
  if (date === undefined) {
    return ''
  }

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Adding 1 to get the correct month
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export default {
  getStartMonth,
  getStartNextMonth,
  formatDate,
}
