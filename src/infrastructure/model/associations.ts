import { SequelizeApplication } from './application/application.model';
import { SequelizeTypeApplication } from './type-application/type-application.model';
import { SequelizeApplicationSetting } from './application-setting/application-setting.model';
import { SequelizeTicket } from './ticket/ticket.model';
import { SequelizeUser } from './user/user.model';
import { SequelizeRol } from './rol/rol.model';
import { SequelizeAppResponsible } from './application-responsible/application-responsible.model';
import { SequelizeTicketStatusLog } from './ticket-status-log/ticket-status-log.model';
import { SequelizeAppUpdate } from './application-update/application-update.model';
import { SequelizeAppBackup } from './application-backup/application-backup.model';
import { SequelizeAppMaintenance } from './application-maintenance/application-maintenance.model';

export function setupAssociations() {
  // Relación entre Aplicación y Tipo de Aplicación
  SequelizeApplication.belongsTo(SequelizeTypeApplication, {
    foreignKey: 'tapp_uuid',
    as: 'typeApplication'
  });

  SequelizeTypeApplication.hasMany(SequelizeApplication, {
    foreignKey: 'tapp_uuid',
    as: 'applications'
  });

  // Relación entre Aplicación y Configuraciones de Aplicación
  SequelizeApplication.hasMany(SequelizeApplicationSetting, {
    foreignKey: 'app_uuid',
    as: 'settings'
  });

  SequelizeApplicationSetting.belongsTo(SequelizeApplication, {
    foreignKey: 'app_uuid',
    as: 'application'
  });

  // Relación entre Ticket, Usuario y Aplicación
  SequelizeTicket.belongsTo(SequelizeUser, { foreignKey: 'usr_uuid', as: 'user' });
  SequelizeUser.hasMany(SequelizeTicket, { foreignKey: 'usr_uuid', as: 'tickets' });

  SequelizeTicket.belongsTo(SequelizeApplication, { foreignKey: 'app_uuid', as: 'application' });
  SequelizeApplication.hasMany(SequelizeTicket, { foreignKey: 'app_uuid', as: 'tickets' });

  // Relaciones para Responsables de Aplicación
  SequelizeAppResponsible.belongsTo(SequelizeUser, { foreignKey: 'usr_uuid', as: 'user' });
  SequelizeUser.hasMany(SequelizeAppResponsible, { foreignKey: 'usr_uuid', as: 'responsibilities' });

  SequelizeAppResponsible.belongsTo(SequelizeApplication, { foreignKey: 'app_uuid', as: 'application' });
  SequelizeApplication.hasMany(SequelizeAppResponsible, { foreignKey: 'app_uuid', as: 'responsibles' });

  SequelizeAppResponsible.belongsTo(SequelizeRol, { foreignKey: 'rol_uuid', as: 'rol' });
  SequelizeRol.hasMany(SequelizeAppResponsible, { foreignKey: 'rol_uuid', as: 'responsibles' });

  // Relaciones para Historial de Tickets (TicketStatusLog)
  SequelizeTicket.hasMany(SequelizeTicketStatusLog, { foreignKey: 'tic_uuid', as: 'statusLogs' });
  SequelizeTicketStatusLog.belongsTo(SequelizeTicket, { foreignKey: 'tic_uuid', as: 'ticket' });

  SequelizeTicketStatusLog.belongsTo(SequelizeUser, { foreignKey: 'usr_uuid', as: 'operator' });
  SequelizeUser.hasMany(SequelizeTicketStatusLog, { foreignKey: 'usr_uuid', as: 'operatorLogs' });

  // Relaciones para Bitácora de Mantenimiento de Apps
  SequelizeApplication.hasMany(SequelizeAppUpdate, { foreignKey: 'app_uuid', as: 'updates' });
  SequelizeAppUpdate.belongsTo(SequelizeApplication, { foreignKey: 'app_uuid', as: 'application' });
  SequelizeAppUpdate.belongsTo(SequelizeUser, { foreignKey: 'usr_uuid', as: 'user' });
  SequelizeUser.hasMany(SequelizeAppUpdate, { foreignKey: 'usr_uuid', as: 'updates' });

  SequelizeApplication.hasMany(SequelizeAppBackup, { foreignKey: 'app_uuid', as: 'backups' });
  SequelizeAppBackup.belongsTo(SequelizeApplication, { foreignKey: 'app_uuid', as: 'application' });
  SequelizeAppBackup.belongsTo(SequelizeUser, { foreignKey: 'usr_uuid', as: 'user' });
  SequelizeUser.hasMany(SequelizeAppBackup, { foreignKey: 'usr_uuid', as: 'backups' });

  SequelizeApplication.hasMany(SequelizeAppMaintenance, { foreignKey: 'app_uuid', as: 'maintenances' });
  SequelizeAppMaintenance.belongsTo(SequelizeApplication, { foreignKey: 'app_uuid', as: 'application' });
  SequelizeAppMaintenance.belongsTo(SequelizeUser, { foreignKey: 'usr_uuid', as: 'user' });
  SequelizeUser.hasMany(SequelizeAppMaintenance, { foreignKey: 'usr_uuid', as: 'maintenances' });
}

