const getStartMonth = (value: Date) => {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0)
}

const getStartNextMonth = (value: Date) => {
  return new Date(value.getFullYear(), value.getMonth() + 1, value.getDate(), 0, 0, 0, 0)
}

export default {
  getStartMonth,
  getStartNextMonth,
}
