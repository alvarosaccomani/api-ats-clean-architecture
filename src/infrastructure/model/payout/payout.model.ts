import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { PayoutEntity } from '../../../domain/payout/payout.entity';
import { SequelizeCompany } from '../company/company.model';

export class SequelizePayout extends Model<PayoutEntity> {
  declare pay_uuid: string;
  declare cmp_uuid: string;
  declare pay_amount: number;
  declare pay_currency: string;
  declare pay_status: string;
  declare pay_provider: string;
  declare pay_providerid: string;
  declare pay_reference: string;
  declare pay_createdat: Date;
  declare pay_updatedat: Date;
}

SequelizePayout.init({
  pay_uuid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  cmp_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pay_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  pay_currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ARS'
  },
  pay_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'PENDING'
  },
  pay_provider: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pay_providerid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pay_reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pay_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  pay_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'pay_createdat',
  updatedAt: 'pay_updatedat',
  tableName: 'pay_payouts'
});

// Relación
SequelizePayout.belongsTo(SequelizeCompany, { foreignKey: 'cmp_uuid', as: 'company' });

// Sincronizar (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
    SequelizePayout.sync();
}
