const formatTime = (dt, separator) => {
  let d = new Date(dt || last.timestamp)
  return `${d.getHours()}${separator||':'}${("0"+(d.getMinutes())).slice(-2)}`
}

export default formatTime