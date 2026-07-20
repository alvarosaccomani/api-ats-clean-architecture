import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { ApplicationEntity } from '../../../domain/application/application.entity';

export class SequelizeApplication extends Model<ApplicationEntity> {
  declare app_uuid: string;
  declare app_cod: string;
  declare app_name: string;
  declare tapp_uuid: string;
  declare app_description: string;
  declare app_dbname: string;
  declare app_url: string;
  declare app_hasaccess: boolean;
  declare app_active: boolean;
  declare app_createdat: Date;
  declare app_updatedat: Date;
}

SequelizeApplication.init({
  app_uuid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  app_cod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  app_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tapp_uuid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  app_description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  app_dbname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  app_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  app_hasaccess: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  app_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  app_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  app_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'app_createdat',
  updatedAt: 'app_updatedat',
  tableName: 'app_applications'
});

// Sincronizar (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
    SequelizeApplication.sync();
}
