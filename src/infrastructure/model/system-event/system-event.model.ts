import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { SystemEventEntity } from '../../../domain/system-event/system-event.entity';
import { SequelizeUser } from '../user/user.model';

export class SequelizeSystemEvent extends Model<SystemEventEntity> {
  declare sysev_uuid: string;
  declare usr_uuid: string;
  declare sysev_action: string;
  declare sysev_entitytype: string;
  declare sysev_entityuuid: string;
  declare sysev_details: string;
  declare sysev_ipaddress: string;
  declare sysev_useragent: string;
  declare sysev_createdat: Date;
}

SequelizeSystemEvent.init({
  sysev_uuid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  usr_uuid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sysev_action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sysev_entitytype: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sysev_entityuuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sysev_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sysev_ipaddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sysev_useragent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sysev_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: false,
  tableName: 'sysev_systemevents'
});

// Relación con el modelo de Usuario
SequelizeSystemEvent.belongsTo(SequelizeUser, { foreignKey: 'usr_uuid', as: 'user' });

if (process.env.NODE_ENV !== "production") {
    SequelizeSystemEvent.sync();
}
