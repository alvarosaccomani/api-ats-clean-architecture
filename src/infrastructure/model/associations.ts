import { SequelizeApplication } from './application/application.model';
import { SequelizeTypeApplication } from './type-application/type-application.model';

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
}
