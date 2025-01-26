export default function TransformTime(date) {
  const now = new Date(date);
  let hours = now.getHours();
  const minutes = now.getMinutes();

  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12; // Convert 24-hour to 12-hour format
  hours = hours ? hours.toString().padStart(2, "0") : 12; // Handle midnight case


  return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
}
