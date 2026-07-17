import moment from 'moment-timezone';

export class TimezoneConverter {
  /**
   * Convierte una fecha UTC a un string ISO 8601 en la zona horaria dada.
   * 
   * Ejemplo:
   *   input: new Date('2024-04-05T14:30:00.000Z'), 'America/Buenos_Aires'
   *   output: '2024-04-05T11:30:00.000-03:00'
   */
  static toIsoStringInTimezone(date: Date, timezone: string): string | null {

    if(!date) {
      return null;
    }

    // Asegúrate de que la fecha se interprete como UTC
    const utcMoment = moment.utc(date);
    
    // Convierte a la zona horaria del usuario
    const localMoment = utcMoment.tz(timezone);
    
    // Devuelve en formato ISO con offset
    return localMoment.format();
  }
}