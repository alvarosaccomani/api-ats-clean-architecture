import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { UserAuthLogEntity } from '../../../domain/user-auth-log/user-auth-log.entity';
import { SequelizeUser } from '../user/user.model';
import { SequelizeApplication } from '../application/application.model';

export class SequelizeUserAuthLog extends Model<UserAuthLogEntity> {
  declare usraulo_uuid: string;
  declare usr_uuid: string;
  declare app_uuid: string;
  declare usraulo_action: string;
  declare usraulo_ipaddress: string;
  declare usraulo_useragent: string;
  declare usraulo_failurereason: string;
  declare usraulo_createdat: Date;
}

SequelizeUserAuthLog.init({
  usraulo_uuid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  usr_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  app_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usraulo_action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usraulo_ipaddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  usraulo_useragent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  usraulo_failurereason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  usraulo_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: false,
  tableName: 'usraulo_usersauthlogs'
});

// Relaciones
SequelizeUserAuthLog.belongsTo(SequelizeUser, { foreignKey: 'usr_uuid', as: 'user' });
SequelizeUserAuthLog.belongsTo(SequelizeApplication, { foreignKey: 'app_uuid', as: 'application' });

// Sincronizar (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
    SequelizeUserAuthLog.sync();
}
