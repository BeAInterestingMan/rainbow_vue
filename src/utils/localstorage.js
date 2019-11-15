let db = {
  save (key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  get (key, defaultValue = {}) {
    return JSON.parse(sessionStorage.getItem(key)) || defaultValue
  },
  remove (key) {
    sessionStorage.removeItem(key)
  },
  clear () {
    sessionStorage.clear()
  }
}

export default db
