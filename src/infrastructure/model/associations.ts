import { SequelizeApplication } from './application/application.model';
import { SequelizeTypeApplication } from './type-application/type-application.model';
import { SequelizeApplicationSetting } from './application-setting/application-setting.model';
import { SequelizeTicket } from './ticket/ticket.model';
import { SequelizeUser } from './user/user.model';

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
}

