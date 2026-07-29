import { SequelizeApplication } from './application/application.model';
import { SequelizeTypeApplication } from './type-application/type-application.model';
import { SequelizeApplicationSetting } from './application-setting/application-setting.model';

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
}

