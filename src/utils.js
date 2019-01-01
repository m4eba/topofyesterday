export function dateString(date) {
  let m = date.getMonth()+1;
  let d = date.getDate();
  return date.getFullYear()+'-'+(m<10?'0'+m:m)+'-'+(d<10?'0'+d:d);
}
