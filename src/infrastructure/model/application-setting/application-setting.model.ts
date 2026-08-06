import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { ApplicationSettingEntity } from '../../../domain/application-setting/application-setting.entity';

export class SequelizeApplicationSetting extends Model<ApplicationSettingEntity> {
  declare app_uuid: string;
  declare apps_uuid: string;
  declare apps_key: string;
  declare apps_parameter: string;
  declare apps_description: string;
  declare apps_value: string;
  declare apps_datatype: string;
  declare apps_options: string;
  declare apps_group: string;
  declare apps_createdat: Date;
  declare apps_updatedat: Date;
}

SequelizeApplicationSetting.init({
  app_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false,
    primaryKey: true
  },
  apps_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false,
    primaryKey: true
  },
  apps_key: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apps_parameter: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apps_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  apps_value: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  apps_datatype: {
    type: DataTypes.STRING(30),
    allowNull: true,
    defaultValue: 'string'
  },
  apps_options: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  apps_group: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'General'
  },
  apps_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  apps_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'apps_createdat',
  updatedAt: 'apps_updatedat',
  tableName: 'apps_applicationssettings'
});

// Sincronizar (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
    SequelizeApplicationSetting.sync();
}
