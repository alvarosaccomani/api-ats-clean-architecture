import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { ApplicationMaintenanceEntity } from "../../../domain/application-maintenance/application-maintenance.entity";

export class SequelizeAppMaintenance extends Model<ApplicationMaintenanceEntity> {
  declare appmaint_uuid: string;
  declare app_uuid: string;
  declare usr_uuid: string;
  declare appmaint_type: string;
  declare appmaint_title: string;
  declare appmaint_description: string;
  declare appmaint_status: string;
  declare appmaint_createdat: Date;
}

SequelizeAppMaintenance.init({
  appmaint_uuid: {
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
  appmaint_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  appmaint_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  appmaint_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  appmaint_status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  appmaint_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'appmaint_createdat',
  updatedAt: false,
  tableName: 'appmaint_applicationmaintenance'
});

if (process.env.NODE_ENV !== "production") {
  SequelizeAppMaintenance.sync();
}
