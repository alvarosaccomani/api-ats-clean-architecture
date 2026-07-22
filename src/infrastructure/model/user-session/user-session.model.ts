import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { UserSessionEntity } from '../../../domain/user-session/user-session.entity';
import { SequelizeUser } from '../user/user.model';

export class SequelizeUserSession extends Model<UserSessionEntity> {
  declare usrs_uuid: string;
  declare usr_uuid: string;
  declare usrs_device: string;
  declare usrs_ipaddress: string;
  declare usrs_refreshtoken: string;
  declare usrs_createdat: Date;
  declare usrs_updatedat: Date;
}

SequelizeUserSession.init({
  usrs_uuid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  usr_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usrs_device: {
    type: DataTypes.STRING,
    allowNull: true
  },
  usrs_ipaddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  usrs_refreshtoken: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usrs_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  usrs_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'usrs_createdat',
  updatedAt: 'usrs_updatedat',
  tableName: 'usrs_userssessions'
});

// Relaciones
SequelizeUserSession.belongsTo(SequelizeUser, { foreignKey: 'usr_uuid', as: 'user' });

// Sincronizar (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
    SequelizeUserSession.sync();
}
