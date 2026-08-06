import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { ApplicationBackupEntity } from "../../../domain/application-backup/application-backup.entity";

export class SequelizeAppBackup extends Model<ApplicationBackupEntity> {
  declare appbak_uuid: string;
  declare app_uuid: string;
  declare usr_uuid: string;
  declare appbak_filename: string;
  declare appbak_size: number;
  declare appbak_status: string;
  declare appbak_storagepath: string;
  declare appbak_createdat: Date;
}

SequelizeAppBackup.init({
  appbak_uuid: {
    type: DataTypes.STRING(40), 
    primaryKey: true
  }, 
  app_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  usr_uuid: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  appbak_filename: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  appbak_size: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  appbak_status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  appbak_storagepath: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  appbak_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'appbak_createdat',
  updatedAt: false,
  tableName: 'appbak_applicationbackups'
});

if (process.env.NODE_ENV !== "production") {
  SequelizeAppBackup.sync();
}
