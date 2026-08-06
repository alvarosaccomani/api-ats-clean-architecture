import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { AppResponsibleEntity } from "../../../domain/application-responsible/application-responsible.entity";

export class SequelizeAppResponsible extends Model<AppResponsibleEntity> {
  declare appres_uuid: string;
  declare app_uuid: string;
  declare usr_uuid: string;
  declare rol_uuid: string;
  declare appres_createdat: Date;
  declare appres_updatedat: Date;
}

SequelizeAppResponsible.init({
  appres_uuid: {
    type: DataTypes.STRING(40), 
    primaryKey: true,
    field: 'appres_Uuid'
  }, 
  app_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false,
    field: 'app_Uuid'
  },
  usr_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false,
    field: 'usr_Uuid'
  },
  rol_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false,
    field: 'rol_Uuid'
  },
  appres_createdat: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'appres_CreatedAt'
  },
  appres_updatedat: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'appres_UpdatedAt'
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'appres_createdat',
  updatedAt: 'appres_updatedat',
  tableName: 'appres_ApplicationResponsibles'
});

if (process.env.NODE_ENV !== "production") {
  SequelizeAppResponsible.sync();
}
