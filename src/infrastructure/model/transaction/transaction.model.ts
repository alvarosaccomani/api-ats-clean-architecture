import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { TransactionEntity } from '../../../domain/transaction/transaction.entity';
import { SequelizeUser } from '../user/user.model';
import { SequelizeSubscription } from '../subscription/subscription.model';
import { SequelizeCompany } from '../company/company.model';
import { SequelizeApplication } from '../application/application.model';

export class SequelizeTransaction extends Model<TransactionEntity> {
  declare trn_uuid: string;
  declare usr_uuid: string;
  declare sub_uuid: string;
  declare cmp_uuid: string;
  declare app_uuid: string;
  declare trn_provider: string;
  declare trn_providerid: string;
  declare trn_amount: number;
  declare trn_currency: string;
  declare trn_platformfee: number;
  declare trn_netamount: number;
  declare trn_status: string;
  declare trn_paymentmethod: string;
  declare trn_description: string;
  declare trn_metadata: string;
  declare trn_createdat: Date;
  declare trn_updatedat: Date;
}

SequelizeTransaction.init({
  trn_uuid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  usr_uuid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sub_uuid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cmp_uuid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  app_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  trn_provider: {
    type: DataTypes.STRING,
    allowNull: false
  },
  trn_providerid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  trn_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  trn_currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ARS'
  },
  trn_platformfee: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  trn_netamount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  trn_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'PENDING'
  },
  trn_paymentmethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  trn_description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  trn_metadata: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  trn_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  trn_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'trn_createdat',
  updatedAt: 'trn_updatedat',
  tableName: 'trn_transactions'
});

// Relaciones
SequelizeTransaction.belongsTo(SequelizeUser, { foreignKey: 'usr_uuid', as: 'user' });
SequelizeTransaction.belongsTo(SequelizeSubscription, { foreignKey: 'sub_uuid', as: 'subscription' });
SequelizeTransaction.belongsTo(SequelizeCompany, { foreignKey: 'cmp_uuid', as: 'company' });
SequelizeTransaction.belongsTo(SequelizeApplication, { foreignKey: 'app_uuid', as: 'application' });

// Sincronizar (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
    SequelizeTransaction.sync();
}
