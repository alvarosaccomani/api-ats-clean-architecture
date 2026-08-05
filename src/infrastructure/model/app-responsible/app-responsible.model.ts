import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { AppResponsibleEntity } from "../../../domain/app-responsible/app-responsible.entity";

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
    primaryKey: true
  }, 
  app_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  usr_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  rol_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  appres_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  appres_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'appres_createdat',
  updatedAt: 'appres_updatedat',
  tableName: 'appres_applicationresponsibles'
});

if (process.env.NODE_ENV !== "production") {
  SequelizeAppResponsible.sync();
}
