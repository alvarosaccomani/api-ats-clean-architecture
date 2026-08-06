import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { ApplicationUpdateEntity } from "../../../domain/application-update/application-update.entity";

export class SequelizeAppUpdate extends Model<ApplicationUpdateEntity> {
  declare appup_uuid: string;
  declare app_uuid: string;
  declare usr_uuid: string;
  declare appup_version: string;
  declare appup_description: string;
  declare appup_createdat: Date;
}

SequelizeAppUpdate.init({
  appup_uuid: {
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
  appup_version: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  appup_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  appup_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'appup_createdat',
  updatedAt: false,
  tableName: 'appup_applicationupdates'
});

if (process.env.NODE_ENV !== "production") {
  SequelizeAppUpdate.sync();
}
