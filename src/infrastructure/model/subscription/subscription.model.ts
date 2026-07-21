import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { SubscriptionEntity } from '../../../domain/subscription/subscription.entity';
import { SequelizePlan } from '../plan/plan.model';
import { SequelizeApplication } from '../application/application.model';
import { SequelizeUser } from '../user/user.model';
import { SequelizeCompany } from '../company/company.model';

export class SequelizeSubscription extends Model<SubscriptionEntity> {
  declare sub_uuid: string;
  declare pla_uuid: string;
  declare app_uuid: string;
  declare sub_subscribertype: string;
  declare usr_uuid: string;
  declare cmp_uuid: string;
  declare sub_status: string;
  declare sub_startsat: Date;
  declare sub_renewsat: Date;
  declare sub_endsat: Date;
  declare sub_active: boolean;
  declare sub_createdat: Date;
  declare sub_updatedat: Date;
}

SequelizeSubscription.init({
  sub_uuid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  pla_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  app_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sub_subscribertype: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'COMPANY'
  },
  usr_uuid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cmp_uuid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sub_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ACTIVE'
  },
  sub_startsat: {
    type: DataTypes.DATE,
    allowNull: false
  },
  sub_renewsat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sub_endsat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sub_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  sub_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sub_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'sub_createdat',
  updatedAt: 'sub_updatedat',
  tableName: 'sub_subscriptions'
});

// Relaciones
SequelizeSubscription.belongsTo(SequelizePlan, { foreignKey: 'pla_uuid', as: 'plan' });
SequelizeSubscription.belongsTo(SequelizeApplication, { foreignKey: 'app_uuid', as: 'application' });
SequelizeSubscription.belongsTo(SequelizeUser, { foreignKey: 'usr_uuid', as: 'user' });
SequelizeSubscription.belongsTo(SequelizeCompany, { foreignKey: 'cmp_uuid', as: 'company' });

// Sincronizar (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
    SequelizeSubscription.sync();
}
