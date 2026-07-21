import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { PlanEntity } from '../../../domain/plan/plan.entity';
import { SequelizeApplication } from '../application/application.model';

export class SequelizePlan extends Model<PlanEntity> {
  declare pla_uuid: string;
  declare app_uuid: string;
  declare pla_cod: string;
  declare pla_name: string;
  declare pla_description: string;
  declare pla_price: number;
  declare pla_currency: string;
  declare pla_billingcycle: string;
  declare pla_pricingtype: string;
  declare pla_platformfeepercent: number;
  declare pla_active: boolean;
  declare pla_createdat: Date;
  declare pla_updatedat: Date;
}

SequelizePlan.init({
  pla_uuid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  app_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pla_cod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pla_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pla_description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pla_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  pla_currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ARS'
  },
  pla_billingcycle: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'MONTHLY'
  },
  pla_pricingtype: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'PER_COMPANY'
  },
  pla_platformfeepercent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  pla_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  pla_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  pla_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'pla_createdat',
  updatedAt: 'pla_updatedat',
  tableName: 'sub_plans'
});

// Relación con Aplicación
SequelizePlan.belongsTo(SequelizeApplication, { foreignKey: 'app_uuid', as: 'application' });
SequelizeApplication.hasMany(SequelizePlan, { foreignKey: 'app_uuid', as: 'plans' });

// Sincronizar (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
    SequelizePlan.sync();
}
