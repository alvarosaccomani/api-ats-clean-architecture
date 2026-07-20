import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { UserCompanyEntity } from '../../../domain/user-company/user-company.entity';
import { SequelizeUser } from '../user/user.model';
import { SequelizeCompany } from '../company/company.model';

export class SequelizeUserCompany extends Model<UserCompanyEntity> {
  declare usrcmp_uuid: string;
  declare usr_uuid: string;
  declare cmp_uuid: string;
  declare usrcmp_role: string;
  declare usrcmp_active: boolean;
  declare usrcmp_createdat: Date;
  declare usrcmp_updatedat: Date;
}

SequelizeUserCompany.init({
  usrcmp_uuid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  usr_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cmp_uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usrcmp_role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'RESIDENT'
  },
  usrcmp_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  usrcmp_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  usrcmp_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'usrcmp_createdat',
  updatedAt: 'usrcmp_updatedat',
  tableName: 'usrcmp_userscompanies'
});

// Relaciones BelongsTo y BelongsToMany
SequelizeUserCompany.belongsTo(SequelizeUser, { foreignKey: 'usr_uuid', as: 'user' });
SequelizeUserCompany.belongsTo(SequelizeCompany, { foreignKey: 'cmp_uuid', as: 'company' });

SequelizeUser.belongsToMany(SequelizeCompany, {
  through: SequelizeUserCompany,
  foreignKey: 'usr_uuid',
  otherKey: 'cmp_uuid',
  as: 'companies'
});

SequelizeCompany.belongsToMany(SequelizeUser, {
  through: SequelizeUserCompany,
  foreignKey: 'cmp_uuid',
  otherKey: 'usr_uuid',
  as: 'users'
});

// Sincronizar (solo en desarrollo)
if (process.env.NODE_ENV !== "production") {
    SequelizeUserCompany.sync();
}
