import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { RolEntity } from "../../../domain/rol/rol.entity";

export class SequelizeRol extends Model<RolEntity> {
  declare rol_uuid: string;
  declare rol_name: string;
  declare rol_createdat: Date;
  declare rol_updatedat: Date;
}

SequelizeRol.init({
  rol_uuid: {
    type: DataTypes.STRING(40), 
    primaryKey: true
  }, 
  rol_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  rol_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rol_updatedat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'rol_createdat',
  updatedAt: 'rol_updatedat',
  tableName: 'rol_roles'
});

if (process.env.NODE_ENV !== "production") {
  SequelizeRol.sync();
}
